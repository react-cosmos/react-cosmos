/* eslint-env browser */
/* global process */

import * as ErrorOverlay from 'react-error-overlay';

const LAUNCH_EDITOR_ENDPOINT = '/__open-stack-frame-in-editor';

ErrorOverlay.startReportingRuntimeErrors({
  onError: reportRuntimeErrorsToParent,
  filename: process.env.PUBLIC_URL + '/main.js'
});

ErrorOverlay.setEditorHandler(errorLocation =>
  window.fetch(getLaunchEditorUrl(errorLocation))
);

reportBuildErrors();
attachGlobalDismissErrorOverlayHandler();

function reportBuildErrors() {
  if (window.__webpack_hot_middleware_reporter__ === undefined) {
    return;
  }

  window.__webpack_hot_middleware_reporter__.useCustomOverlay({
    showProblems(type, obj) {
      if (type !== 'errors') {
        // We might've went from errors -> warnings
        ErrorOverlay.dismissBuildError();
      } else {
        ErrorOverlay.reportBuildError(obj[0]);
      }
    },
    clear() {
      ErrorOverlay.dismissBuildError();
    }
  });
}

function attachGlobalDismissErrorOverlayHandler() {
  window.dismissErrorOverlay = ErrorOverlay.dismissRuntimeErrors;
}

function reportRuntimeErrorsToParent() {
  if (typeof parent.onRendererRuntimeError === 'function') {
    parent.onRendererRuntimeError();
  }
}

function getLaunchEditorUrl(errorLocation) {
  const fileName = encodeURIComponent(errorLocation.fileName);
  const lineNumber = encodeURIComponent(errorLocation.lineNumber || 1);
  const colNumber = encodeURIComponent(colNumber.fileName || 1);

  return `${LAUNCH_EDITOR_ENDPOINT}?fileName=${fileName}&lineNumber=${lineNumber}&colNumber=${colNumber}`;
}

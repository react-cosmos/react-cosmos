/* eslint-env browser */
/* global process */

import * as ErrorOverlay from 'react-error-overlay';

const LAUNCH_EDITOR_ENDPOINT = '/__open-stack-frame-in-editor';

export function init() {
  ErrorOverlay.startReportingRuntimeErrors({
    onError: reportRuntimeErrorsToParentWindow,
    filename: process.env.PUBLIC_URL + '/main.js'
  });

  ErrorOverlay.setEditorHandler(errorLocation =>
    window.fetch(getLaunchEditorUrl(errorLocation))
  );

  setUpBuildErrorReporting();
}

export function dismiss() {
  ErrorOverlay.dismissRuntimeErrors();
}

function reportRuntimeErrorsToParentWindow() {
  if (typeof parent.onRendererRuntimeError === 'function') {
    parent.onRendererRuntimeError();
  }
}

function getLaunchEditorUrl(errorLocation) {
  const fileName = encodeURIComponent(errorLocation.fileName);
  const lineNumber = encodeURIComponent(errorLocation.lineNumber || 1);
  const colNumber = encodeURIComponent(errorLocation.colNumber || 1);

  return `${LAUNCH_EDITOR_ENDPOINT}?fileName=${fileName}&lineNumber=${lineNumber}&colNumber=${colNumber}`;
}

function setUpBuildErrorReporting() {
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

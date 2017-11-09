/* global window */

import * as ErrorOverlay from 'react-error-overlay';

if (process.env.NODE_ENV === 'development') {
  // Report runtime errors
  ErrorOverlay.startReportingRuntimeErrors({
    onError: () => {
      // Let the Playground know when the Loader crashes
      parent.postMessage({ type: 'runtimeError' }, '*');
    },
    filename: '/loader/main.js'
  });
  ErrorOverlay.setEditorHandler(errorLocation =>
    window.fetch(
      '/__open-stack-frame-in-editor?fileName=' +
        window.encodeURIComponent(errorLocation.fileName) +
        '&lineNumber=' +
        window.encodeURIComponent(errorLocation.lineNumber || 1)
    )
  );

  if (window.__webpack_hot_middleware_reporter__ !== undefined) {
    // Report build errors
    window.__webpack_hot_middleware_reporter__.useCustomOverlay({
      showProblems(type, obj) {
        if (type !== 'errors') {
          // We might've went from errors -> warnings
          ErrorOverlay.dismissBuildError();
          return;
        }
        ErrorOverlay.reportBuildError(obj[0]);
      },
      clear() {
        ErrorOverlay.dismissBuildError();
      }
    });
  }
}

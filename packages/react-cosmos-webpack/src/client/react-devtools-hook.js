/* global window */
import * as ErrorOverlay from 'react-error-overlay';

// This has to be done before React is imported. So this files has to be
// imported before anything which might import React
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
if (process.env.NODE_ENV === 'development') {
  // Accessing the parent window can throw when loading a static export without
  // a web server (i.e. via file:/// protocol)
  try {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
      window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  } catch (err) {
    console.error(err);
  }

  // Report runtime errors
  ErrorOverlay.startReportingRuntimeErrors({
    onError: () => {},
    filename: '/loader/main.js'
  });
  ErrorOverlay.setEditorHandler(function editorHandler(errorLocation) {
    window.fetch(
      '/__open-stack-frame-in-editor?fileName=' +
        window.encodeURIComponent(errorLocation.fileName) +
        '&lineNumber=' +
        window.encodeURIComponent(errorLocation.lineNumber || 1)
    );
  });

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

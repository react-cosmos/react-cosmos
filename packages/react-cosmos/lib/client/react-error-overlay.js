'use strict';

var _reactErrorOverlay = require('react-error-overlay');

var ErrorOverlay = _interopRequireWildcard(_reactErrorOverlay);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

if (process.env.NODE_ENV === 'development') {
  // Report runtime errors
  ErrorOverlay.startReportingRuntimeErrors({
    onError: function onError() {
      // Let the Playground know when the Loader crashes
      parent.postMessage({ type: 'runtimeError' }, '*');
    },
    filename: '/loader/main.js'
  });
  ErrorOverlay.setEditorHandler(function(errorLocation) {
    return window.fetch(
      '/__open-stack-frame-in-editor?fileName=' +
        window.encodeURIComponent(errorLocation.fileName) +
        '&lineNumber=' +
        window.encodeURIComponent(errorLocation.lineNumber || 1)
    );
  });

  if (window.__webpack_hot_middleware_reporter__ !== undefined) {
    // Report build errors
    window.__webpack_hot_middleware_reporter__.useCustomOverlay({
      showProblems: function showProblems(type, obj) {
        if (type !== 'errors') {
          // We might've went from errors -> warnings
          ErrorOverlay.dismissBuildError();
          return;
        }
        ErrorOverlay.reportBuildError(obj[0]);
      },
      clear: function clear() {
        ErrorOverlay.dismissBuildError();
      }
    });
  }
} /* global window */

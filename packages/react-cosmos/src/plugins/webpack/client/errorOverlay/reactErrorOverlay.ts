import * as ErrorOverlay from 'react-error-overlay';

type WebpackHotMiddlewareReporter = {
  useCustomOverlay: (args: {
    showProblems(type: string, object: any[]): unknown;
    clear(): unknown;
  }) => unknown;
};

type WebpackHotClientWindow = Window & {
  __webpack_hot_middleware_reporter__?: WebpackHotMiddlewareReporter;
};

const LAUNCH_EDITOR_ENDPOINT = '/__open-stack-frame-in-editor';

export function init() {
  ErrorOverlay.startReportingRuntimeErrors({
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

function getLaunchEditorUrl(errorLocation: ErrorOverlay.ErrorLocation) {
  const fileName = encodeURIComponent(errorLocation.fileName);
  const lineNumber = encodeURIComponent(String(errorLocation.lineNumber || 1));
  const colNumber = encodeURIComponent(String(errorLocation.colNumber || 1));

  return `${LAUNCH_EDITOR_ENDPOINT}?fileName=${fileName}&lineNumber=${lineNumber}&colNumber=${colNumber}`;
}

function setUpBuildErrorReporting() {
  const clientWindow = window as WebpackHotClientWindow;
  if (clientWindow.__webpack_hot_middleware_reporter__ === undefined) {
    return;
  }

  clientWindow.__webpack_hot_middleware_reporter__.useCustomOverlay({
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

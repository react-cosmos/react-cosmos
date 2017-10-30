import './react-devtools-hook';
import {
  startReportingRuntimeErrors,
  reportBuildError,
  dismissBuildError
} from 'react-error-overlay';

function run() {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  const mount = require('./mount').default;
  mount();
}

run();

if (module.hot) {
  module.hot.accept('./mount', run);
}

// Hook for Cypress to simulate a HMR update
window.__runCosmosLoader = run;

// Report runtime errors
startReportingRuntimeErrors({
  launchEditorEndpoint: '/__open-stack-frame-in-editor',
  onError: () => {}, // TODO: consider forcing a full reload after an error and stopping HMR
  filename: '/loader/main.js'
});

if (window['__webpack_hot_middleware_reporter__'] != null) {
  // Report build errors
  window['__webpack_hot_middleware_reporter__'].useCustomOverlay({
    showProblems(type, obj) {
      if (type !== 'errors') {
        // We might've went from errors -> warnings
        dismissBuildError();
        return;
      }
      reportBuildError(obj[0]);
    },
    clear() {
      dismissBuildError();
    }
  });
}

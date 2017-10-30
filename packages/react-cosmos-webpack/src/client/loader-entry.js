import './react-devtools-hook';
import { startReportingRuntimeErrors } from 'react-error-overlay';

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
  launchEditorEndpoint: '', // TODO: disabled for now
  onError: () => {}, // TODO: consider forcing a full reload after an error and stopping HMR
  filename: '/loader/main.js'
});

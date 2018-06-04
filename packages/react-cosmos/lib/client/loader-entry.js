'use strict';

require('./react-devtools-hook');

require('./react-error-overlay');

function run() {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  var mount = require('./mount').default;
  mount();
}

run();

if (module.hot) {
  module.hot.accept('./mount', run);
}

// Hook for Cypress to simulate a HMR update
window.__runCosmosLoader = run;

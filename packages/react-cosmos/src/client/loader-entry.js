import './react-devtools-hook';
import './react-error-overlay';
import values from 'object.values';

if (!Object.values) {
  values.shim();
}

const isDev = process.env.NODE_ENV === 'development';

function run() {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  const mount = require('./mount').default;
  mount({ isDev });
}

run();

if (module.hot) {
  module.hot.accept('./mount', run);
}

// Hook for Cypress to simulate a HMR update
window.__runCosmosLoader = run;

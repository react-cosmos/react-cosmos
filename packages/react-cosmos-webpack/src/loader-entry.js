/* global window */

// This has to be done before React is imported. We do it before importing
// anything which might import React
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
}

const {
  default: importModule
} = require('react-cosmos-utils/lib/import-module');
const {
  normalizeComponents,
  normalizeFixtures
} = require('./normalize-modules');
const { mount, unmount } = require('react-cosmos-loader');

// eslint-disable-next-line no-undef
const { containerQuerySelector } = COSMOS_CONFIG;

const start = () => {
  // Unmounting needs to be done before importing new modules after HMR
  unmount();

  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  const getUserModules = require('./user-modules').default;
  const { components, fixtures, proxies } = getUserModules();

  mount({
    proxies: importModule(proxies),
    components: normalizeComponents(components),
    fixtures: normalizeFixtures(fixtures),
    containerQuerySelector
  });
};

start();

if (module.hot) {
  module.hot.accept('./user-modules', () => {
    start();
  });
}

// Hook for Cypress to simulate a HMR update
window.__startCosmosLoader = start;

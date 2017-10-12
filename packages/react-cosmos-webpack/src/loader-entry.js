/* global window */

import { getComponents } from '@skidding/react-cosmos-voyager2/lib/client/getComponents';

// TODO: Put in a separate file and use regular imports
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
const { normalizeModules } = require('./normalize-modules');
const { mount } = require('react-cosmos-loader');

// eslint-disable-next-line no-undef
const { containerQuerySelector } = COSMOS_CONFIG;

const start = () => {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  const getUserModules = require('./user-modules').default;
  const { fixtureModules, fixtureFiles, proxies } = getUserModules();

  // TODO: New fs API coming fru
  const componentsNew = getComponents({
    fixtureModules: normalizeModules(fixtureModules),
    fixtureFiles
  });

  const components = {};
  const fixtures = {};

  // Temporary conversion to old format
  componentsNew.forEach(c => {
    components[c.name] = c.type;
    fixtures[c.name] = {};

    c.fixtures.forEach(f => {
      fixtures[c.name][f.name] = f.source;
    });
  });

  mount({
    proxies: importModule(proxies),
    components,
    fixtures,
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

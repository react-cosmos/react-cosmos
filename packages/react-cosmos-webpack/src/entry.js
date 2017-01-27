/* global window */

import importModule from 'react-cosmos-utils/lib/import-module';

const loaderUri = '/loader/';
const { pathname } = window.location;
const isLoader = pathname === loaderUri;

// This has to be done before React is imported. We do it before importing
// anything which might import React
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
if (isLoader) {
  // eslint-disable-next-line no-underscore-dangle
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

const { startLoader, startPlayground } = require('react-cosmos');
const getConfig = require('./config').default;

// eslint-disable-next-line no-undef
const userConfig = require(COSMOS_CONFIG_PATH);
const { proxies, containerQuerySelector } = getConfig(importModule(userConfig));

const start = () => {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  // eslint-disable-next-line global-require
  const getUserModules = require('./user-modules').default;
  const { components, fixtures } = getUserModules();

  if (isLoader) {
    startLoader({
      proxies,
      components,
      fixtures,
      containerQuerySelector,
    });
  } else {
    startPlayground({
      fixtures,
      loaderUri,
    });
  }
};

start();

if (module.hot) {
  module.hot.accept('./user-modules', () => {
    start();
  });
}

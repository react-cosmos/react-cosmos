/* global window */

const loaderUri = './loader/index.html';
const { pathname } = window.location;
const isLoader = pathname.match(/loader\/index\.html$/);

// This has to be done before React is imported. We do it before importing
// anything which might import React
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
if (isLoader && process.env.NODE_ENV === 'development') {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

const { startLoader, startPlayground } = require('react-cosmos');

// eslint-disable-next-line no-undef
const { containerQuerySelector } = COSMOS_CONFIG;

const start = () => {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  const getUserModules = require('./user-modules').default;
  const { components, fixtures, proxies } = getUserModules();

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

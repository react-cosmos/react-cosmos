/* global window */

// This has to be done before React is imported. We do it before importing
// anything which might import React
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
if (window.parent !== window) {
  // eslint-disable-next-line no-underscore-dangle
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

const { startLoader, startPlayground } = require('react-cosmos');
const getConfig = require('./config').default;
const expandModulePaths = require('./utils/expand-module-paths').default;

// eslint-disable-next-line no-undef
const userConfig = require(COSMOS_CONFIG_PATH);
const { proxies, containerQuerySelector, ignore } = getConfig(userConfig);

// The following constants are replaced at compile-time (through entry-loader)
// with a map of require.context calls with absolute paths, derived from user
// conf. By the time webpack analyzes this file to build the dependency tree
// all paths will be embedded and webpack will register watchers for each
// context (which will update the bundle automatically when files are added or
// changed).
// eslint-disable-next-line no-undef
const { components, fixtures } = expandModulePaths(COMPONENT_CONTEXTS, FIXTURE_CONTEXTS, ignore);

const loaderUri = '/loader/';
const { pathname } = window.location;

if (pathname === loaderUri) {
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

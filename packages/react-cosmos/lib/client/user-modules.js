'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// The constants are replaced at compile-time (via embed-modules-webpack-loader)
// with a map of require calls with absolute paths, derived from user conf.
// By the time webpack analyzes this file to build the dependency tree
// all paths will be embedded and webpack will register watchers for each
// context (which will update the bundle automatically when files are added or
// changed).

// eslint-disable-next-line no-undef, no-unused-expressions
CONTEXTS;

var getUserModules = function getUserModules() {
  return {
    /* eslint-disable no-undef */
    fixtureModules: FIXTURE_MODULES,
    fixtureFiles: FIXTURE_FILES,
    deprecatedComponentModules: DEPRECATED_COMPONENT_MODULES,
    proxies: PROXIES
    /* eslint-enable no-undef */
  };
};

exports.default = getUserModules;

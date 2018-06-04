'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fixtureExtensions = require('./fixture-extensions');

var buildPathMatchers = function buildPathMatchers(componentName, fixturesDir) {
  return [
    '/' +
      fixturesDir +
      '/' +
      componentName +
      '/([^/]+)\\.(' +
      _fixtureExtensions.FIXTURE_EXTENSIONS_REGEX +
      ')$',
    '/' +
      componentName +
      '/' +
      fixturesDir +
      '/([^/]+)\\.(' +
      _fixtureExtensions.FIXTURE_EXTENSIONS_REGEX +
      ')$',
    '/' +
      componentName +
      '/([^/]+)\\.(' +
      _fixtureExtensions.FIXTURE_EXTENSIONS_REGEX +
      ')$'
  ];
};

var buildDeprecatedPathMatchers = function buildDeprecatedPathMatchers(
  componentName,
  fixturesDir
) {
  return [
    '/' +
      componentName +
      '/src/' +
      fixturesDir +
      '/([^/]+)\\.(' +
      _fixtureExtensions.FIXTURE_EXTENSIONS_REGEX +
      ')$'
  ];
};

/**
 * Determine whether fixture belongs to component and return the fixture's
 * clean path when true.
 */
var matchFixturePath = function matchFixturePath(
  fixturePath,
  componentName,
  fixturesDir
) {
  var matchers = buildPathMatchers(componentName, fixturesDir);

  for (var i = 0; i < matchers.length; i += 1) {
    var matchResult = fixturePath.match(new RegExp(matchers[i]));
    if (matchResult) {
      return matchResult[1];
    }
  }

  var deprecatedMatchers = buildDeprecatedPathMatchers(
    componentName,
    fixturesDir
  );

  for (var _i = 0; _i < deprecatedMatchers.length; _i += 1) {
    var _matchResult = fixturePath.match(new RegExp(deprecatedMatchers[_i]));
    if (_matchResult) {
      console.warn(
        'The fixture path "' +
          fixturePath +
          '" for component name "' +
          componentName +
          '" has matched a deprecated pattern ' +
          deprecatedMatchers[_i] +
          ', use getFixturePathsForComponent in your cosmos.config.js to handle special cases instead'
      );
      return _matchResult[1];
    }
  }

  return false;
};

exports.default = matchFixturePath;

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _matchFixturePath = require('./match-fixture-path');

var _matchFixturePath2 = _interopRequireDefault(_matchFixturePath);

var _fixtureExtensions = require('./fixture-extensions');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var SPECIAL_DIRS = ['__tests__'];

var isUnderSpecialDir = function isUnderSpecialDir(filePath, fixturesDir) {
  return SPECIAL_DIRS.concat(fixturesDir).some(function(dir) {
    return filePath.indexOf('/' + dir + '/') !== -1;
  });
};

var getExternalFixtures = function getExternalFixtures(fixturePaths) {
  return fixturePaths.reduce(function(prev, next) {
    return [].concat(
      (0, _toConsumableArray3.default)(prev),
      (0, _toConsumableArray3.default)(
        _glob2.default.sync(
          next + '/**/*.{' + _fixtureExtensions.FIXTURE_EXTENSIONS_GLOB + '}'
        )
      )
    );
  }, []);
};

var extractComponentName = function extractComponentName(filePath, rootPath) {
  var componentName = filePath
    .replace(new RegExp('^' + rootPath + '/?(.+)$'), '$1')
    .replace(/\.jsx?$/, '');

  // Nested components are normalized. E.g. Header/Header.jsx will only
  // show up as "Header" in the UI and will read fixtures from
  // Header/__fixtures__ or from a custom fixture path.
  // The same goes for Header/index.js
  var parts = componentName.split('/');
  if (parts.length > 1) {
    if (
      parts[parts.length - 1] === parts[parts.length - 2] ||
      parts[parts.length - 1] === 'index'
    ) {
      componentName = parts.slice(0, -1).join('/');
    }
  }

  return componentName;
};

var getMatchingFixtures = function getMatchingFixtures(
  fixtures,
  componentName,
  fixturesDir
) {
  return fixtures.reduce(function(matchingFixtures, fixturePath) {
    var fixtureName = (0, _matchFixturePath2.default)(
      fixturePath,
      componentName,
      fixturesDir
    );
    return fixtureName
      ? (0, _extends4.default)(
          {},
          matchingFixtures,
          (0, _defineProperty3.default)({}, fixtureName, fixturePath)
        )
      : matchingFixtures;
  }, {});
};

var getFilePaths = function getFilePaths(_ref) {
  var _ref$componentPaths = _ref.componentPaths,
    componentPaths =
      _ref$componentPaths === undefined ? [] : _ref$componentPaths,
    _ref$fixturePaths = _ref.fixturePaths,
    fixturePaths = _ref$fixturePaths === undefined ? [] : _ref$fixturePaths,
    _ref$fixturesDir = _ref.fixturesDir,
    fixturesDir =
      _ref$fixturesDir === undefined ? '__fixtures__' : _ref$fixturesDir,
    _ref$ignore = _ref.ignore,
    ignore = _ref$ignore === undefined ? [] : _ref$ignore,
    getComponentName = _ref.getComponentName,
    getFixturePathsForComponent = _ref.getFixturePathsForComponent;

  var extFixtures = getExternalFixtures(fixturePaths);
  var components = {};
  var fixtures = {};

  componentPaths.forEach(function(componentPath) {
    if (_fs2.default.lstatSync(componentPath).isFile()) {
      if (typeof getComponentName !== 'function') {
        throw new TypeError(
          'Must implement getComponentName when using exact file paths in componentPaths'
        );
      }

      var componentDir = _path2.default.dirname(componentPath);
      var componentName = getComponentName(componentPath);

      components[componentName] = componentPath;
      fixtures[componentName] =
        typeof getFixturePathsForComponent === 'function'
          ? getFixturePathsForComponent(componentName)
          : getMatchingFixtures(
              [].concat(
                (0, _toConsumableArray3.default)(
                  _glob2.default.sync(
                    componentDir +
                      '/**/' +
                      fixturesDir +
                      '/**/*.{' +
                      _fixtureExtensions.FIXTURE_EXTENSIONS_GLOB +
                      '}'
                  )
                ),
                (0, _toConsumableArray3.default)(extFixtures)
              ),
              componentName,
              fixturesDir
            );
    } else {
      var relFixtures = _glob2.default.sync(
        componentPath +
          '/**/' +
          fixturesDir +
          '/**/*.{' +
          _fixtureExtensions.FIXTURE_EXTENSIONS_GLOB +
          '}'
      );
      _glob2.default
        .sync(
          componentPath +
            '/**/*.{' +
            _fixtureExtensions.COMPONENT_EXTENSIONS_GLOB +
            '}'
        )
        .forEach(function(filePath) {
          if (
            isUnderSpecialDir(filePath, fixturesDir) ||
            ignore.some(function(ignorePattern) {
              return filePath.match(ignorePattern);
            })
          ) {
            return;
          }

          var componentName = extractComponentName(filePath, componentPath);

          components[componentName] = filePath;
          fixtures[componentName] =
            typeof getFixturePathsForComponent === 'function'
              ? getFixturePathsForComponent(componentName)
              : getMatchingFixtures(
                  [].concat(
                    (0, _toConsumableArray3.default)(relFixtures),
                    (0, _toConsumableArray3.default)(extFixtures)
                  ),
                  componentName,
                  fixturesDir
                );
        });
    }
  });

  return {
    components: components,
    fixtures: fixtures
  };
};

exports.default = getFilePaths;

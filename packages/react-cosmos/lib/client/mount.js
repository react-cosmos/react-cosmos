'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

exports.default = function() {
  var _getUserModules = (0, _userModules2.default)(),
    fixtureModules = _getUserModules.fixtureModules,
    fixtureFiles = _getUserModules.fixtureFiles,
    deprecatedComponentModules = _getUserModules.deprecatedComponentModules,
    proxies = _getUserModules.proxies;

  // Old fixtures don't have a `component` property. To support both old & new
  // fixtures simultaneously, old style fixtures are altered on the fly by
  // adding each fixture's corresponding component in the fixture body.
  // FYI: deprecatedComponentModules is empty when using new style fixtures
  // exclusively.

  var normalizedFixtureModules = getNormalizedFixtureModules(
    fixtureModules,
    fixtureFiles,
    deprecatedComponentModules
  );

  // TEMP: The new data structures are ready on the server, but are not
  // yet adopted on the client. This conversion will be removed when the Loader
  // and CP start working with the types from react-cosmos-voyager2
  var newStyleComponents = (0, _client.getComponents)({
    fixtureModules: normalizedFixtureModules,
    fixtureFiles: fixtureFiles
  });
  var fixtures = getOldSchoolFixturesFromNewStyleComponents(newStyleComponents);

  (0, _reactCosmosLoader.mount)({
    proxies: (0, _reactCosmosShared.importModule)(proxies),
    fixtures: fixtures,
    loaderOpts: loaderOpts,
    dismissRuntimeErrors: _reactErrorOverlay.dismissRuntimeErrors
  });
};

var _reactCosmosShared = require('react-cosmos-shared');

var _client = require('react-cosmos-voyager2/lib/client');

var _userModules = require('./user-modules');

var _userModules2 = _interopRequireDefault(_userModules);

var _reactCosmosLoader = require('react-cosmos-loader');

var _reactErrorOverlay = require('react-error-overlay');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// eslint-disable-next-line no-undef
var loaderOpts = COSMOS_CONFIG;

function getNormalizedFixtureModules(
  fixtureModules,
  fixtureFiles,
  deprecatedComponentModules
) {
  var alteredFixtures = new Set();
  var invalidFixtures = new Set();

  var modules = Object.keys(fixtureModules).reduce(function(acc, next) {
    var fixtureModule = (0, _reactCosmosShared.importModule)(
      fixtureModules[next]
    );

    // Component seems to be up to date, no alteration needed
    // Warn: Since multi fixtures weren't supported before v3, we assume multi
    // fixtures (Array default export) to be legit new style fixtures
    if (Array.isArray(fixtureModule) || fixtureModule.component) {
      return (0, _extends5.default)(
        {},
        acc,
        (0, _defineProperty3.default)({}, next, fixtureModule)
      );
    }

    try {
      var fixtureFile = fixtureFiles.find(function(f) {
        return f.filePath === next;
      });
      var components = fixtureFile.components;

      var componentModule = deprecatedComponentModules[components[0].filePath];
      var component = (0, _reactCosmosShared.importModule)(componentModule);

      alteredFixtures.add(next);

      return (0, _extends5.default)(
        {},
        acc,
        (0, _defineProperty3.default)(
          {},
          next,
          (0, _extends5.default)({}, fixtureModule, {
            component: component
          })
        )
      );
    } catch (err) {
      invalidFixtures.add(next);

      return acc;
    }
  }, {});

  if (alteredFixtures.size > 0) {
    console.log(
      '[Cosmos] Successfully read ' +
        alteredFixtures.size +
        ' old school fixtures:'
    );
    console.log(getPrintableListFromPaths(alteredFixtures));
  }

  if (invalidFixtures.size > 0) {
    console.warn(
      '[Cosmos] Failed to read ' + invalidFixtures.size + ' fixtures:'
    );
    console.warn(getPrintableListFromPaths(invalidFixtures));
  }

  if (alteredFixtures.size > 0 || invalidFixtures.size > 0) {
    console.log(
      '[Cosmos] Upgrade these fixtures by adding the `component` property.'
    );
    console.log(
      '[Cosmos] More details at https://github.com/react-cosmos/react-cosmos/issues/440'
    );
  }

  return modules;
}

function getOldSchoolFixturesFromNewStyleComponents(newStyleComponents) {
  var fixtures = {};

  newStyleComponents.forEach(function(c) {
    var componentName = getObjectPath(c);
    fixtures[componentName] = {};

    c.fixtures.forEach(function(f) {
      var fixtureName = getObjectPath(f);
      fixtures[componentName][fixtureName] = f.source;
    });
  });

  return fixtures;
}

function getPrintableListFromPaths(set) {
  return []
    .concat((0, _toConsumableArray3.default)(set.values()))
    .map(function(f) {
      return '- ' + f;
    })
    .join('\n');
}

function getObjectPath(obj) {
  return obj.namespace ? obj.namespace + '/' + obj.name : obj.name;
}

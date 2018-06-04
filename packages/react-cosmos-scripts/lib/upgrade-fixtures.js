'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = upgradeFixtures;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash.camelcase');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.upperfirst');

var _lodash4 = _interopRequireDefault(_lodash3);

var _reactCosmosConfig = require('react-cosmos-config');

var _reactCosmosVoyager = require('react-cosmos-voyager');

var _reactCosmosVoyager2 = _interopRequireDefault(_reactCosmosVoyager);

var _addComponentToFixture = require('./transforms/add-component-to-fixture');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var keys = Object.keys;
function upgradeFixtures() {
  var config = (0, _reactCosmosConfig.getCosmosConfig)();

  if (config.componentPaths.length === 0) {
    console.warn('[Cosmos] Could not find `componentPaths` in config. Abort.');
  }

  var _getFilePaths = (0, _reactCosmosVoyager2.default)(config),
    components = _getFilePaths.components,
    fixtures = _getFilePaths.fixtures;

  keys(fixtures).forEach(function(componentName) {
    keys(fixtures[componentName]).forEach(function(fixtureName) {
      var fixturePath = fixtures[componentName][fixtureName];
      var componentPathAbs = components[componentName];
      var componentPath = _path2.default.relative(
        _path2.default.dirname(fixturePath),
        componentPathAbs
      );

      var fixtureCode = _fs2.default.readFileSync(fixturePath, 'utf8');
      var newFixtureCode = (0, _addComponentToFixture.addComponentToFixture)({
        fixtureCode: fixtureCode,
        componentPath: componentPath,
        componentName: getIdentifiableComponentName(componentName)
      });
      _fs2.default.writeFileSync(fixturePath, newFixtureCode, 'utf8');
    });
  });
}

function getIdentifiableComponentName(name) {
  return (0, _lodash4.default)((0, _lodash2.default)(name.split('/').pop()));
}

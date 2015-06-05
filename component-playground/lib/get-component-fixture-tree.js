var parseFixturePath = require('./parse-fixture-path.js');
var parseComponentPath = require('./parse-component-path.js');

module.exports = function() {
  var requireFixture = require.context('fixtures', true, /\.js$/),
    requireComponent = require.context('components', true, /\.jsx?$/),
    fixtures = {};

  requireFixture.keys().forEach(function(fixturePath) {
    var pathParts = parseFixturePath(fixturePath),
      componentName = pathParts[1],
      fixtureName = pathParts[2];

    // Fixtures are grouped per component
    if (!fixtures[componentName]) {
      fixtures[componentName] = {
        class: require('components/' + componentName),
        fixtures: {}
      };
    }

    fixtures[componentName].fixtures[fixtureName] = requireFixture(fixturePath);
  });

  requireComponent.keys().forEach(function(componentPath) {
    var componentName = parseComponentPath(componentPath)[1];
    if (!fixtures[componentName]) {
      fixtures[componentName] = {
        class: require('components/' + componentName),
        fixtures: {
          'auto-generated-empty-fixture': {}
        }
      }
    }
  });

  return fixtures;
};

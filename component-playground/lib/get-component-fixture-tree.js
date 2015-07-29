var parseFixturePath = require('./parse-fixture-path.js');

module.exports = function() {
  var requireFixture = require.context('fixtures', true, /fixture\.\w+\.js$/),
      fixtures = {};

  requireFixture.keys().forEach(function(fixturePath) {
    var pathParts = parseFixturePath(fixturePath),
        componentName = pathParts[1],
        fixtureName = pathParts[2];

    // Fixtures are grouped per component
    if (!fixtures[componentName]) {
      fixtures[componentName] = {
        class: require('components/' + componentName + '/index.jsx'),
        fixtures: {}
      };
    }

    fixtures[componentName].fixtures[fixtureName] = requireFixture(fixturePath);
  });

  return fixtures;
};

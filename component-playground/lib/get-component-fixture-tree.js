var parseFixturePath = require('./parse-fixture-path.js');

module.exports = function() {
  var requireFixture = require.context('fixtures', true, /fixture\.\w+\.js$/),
      fixtures = {};

  requireFixture.keys().forEach(function(fixturePath) {
    var pathParts = parseFixturePath(fixturePath),
        componentName = pathParts[1],
        fixtureName = pathParts[2];

    var componentFileExport = require('components/' + componentName + '/index.jsx');
    // hack – fixes problem where using ES6 named export from component .jsx file breaks webpack require.
    if (!(typeof(componentFileExport) == 'function') && componentFileExport.default) {
      componentFileExport = componentFileExport.default;
    }
    // Fixtures are grouped per component
    if (!fixtures[componentName]) {
      fixtures[componentName] = {
        class: componentFileExport,
        fixtures: {}
      };
    }

    fixtures[componentName].fixtures[fixtureName] = requireFixture(fixturePath);
  });

  return fixtures;
};

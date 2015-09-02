var parseFixturePath = require('./parse-fixture-path.js');

// hack – fixes problem where using ES6 named export and default export together breaks cosmos.
function _getDefaultExportIfMultiple(fileExport) {
  if (fileExport.__esModule && typeof(fileExport.default) !== 'undefined') {
    return fileExport.default;
  }
  return fileExport;
}

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
        class: _getDefaultExportIfMultiple(require('components/' + componentName + '/index.jsx')),
        fixtures: {}
      };
    }

    fixtures[componentName].fixtures[fixtureName] = _getDefaultExportIfMultiple(requireFixture(fixturePath));
  });

  return fixtures;
};

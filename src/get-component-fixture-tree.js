/**
  * This file holds the logic for aggregating all the component and fixture
  * paths from the drive for the Component Playground. It could easily be a
  * separate module, but since the file structure differs from project to
  * project, it's useful to be able to alter this file as needed.
  *
  * Output example:
  * {
  *   "SimpleButton": {
  *     "class": [ReactClass],
  *     "fixtures": {
  *       "disabled": {
  *         "disabled": true
  *       },
  *       "with-100-clicks": {
  *         "disabled": false,
  *         "state": {
  *           "clicks": 100
  *         }
  *       }
  *     }
  *   }
  * }
  */
 
var normalizeModule = function (module) {
    return (module.default) ? module.default : module;
};
module.exports = function() {
  var requireComponent = require.context('COSMOS_COMPONENTS', true),
      isComponent = /^\.\/(.+)\.jsx?$/,
      components = {};

  requireComponent.keys().forEach(function(componentPath) {
    var match = componentPath.match(isComponent);
    if (!match) {
      return;
    }

    // Fixtures are grouped per component
    var componentName = match[1];
    components[componentName] = {
      class: normalizeModule(requireComponent(componentPath)),
      fixtures: getFixturesForComponent(componentName)
    };

    // Allow users to browse components before creating fixtures
    if (!Object.keys(components[componentName].fixtures).length) {
      components[componentName].fixtures['auto-empty'] = {};
    }
  });

  return components;
};

var getFixturesForComponent = function(componentName) {
  var requireFixture = require.context('COSMOS_FIXTURES', true),
      isFixtureOfComponent = new RegExp('./' + componentName + '/([^/]+).js$'),
      fixtures = {};

  requireFixture.keys().forEach(function(fixturePath) {
    var match = fixturePath.match(isFixtureOfComponent);
    if (match) {
      fixtures[match[1]] = normalizeModule(requireFixture(fixturePath));
    }
  });

  return fixtures;
};

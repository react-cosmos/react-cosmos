/**
  * This file holds the logic for aggregating all the component and fixture
  * paths into the input format of the Component Playground.
  *
  * TODO: Make fixtures optional.
  *
  * Input example:
  * {
  *   "ButtonBearer": Object,
  *   "SimpleButton": function (props, context, updater),
  *   "StatelessButton": function StatelessButton(props)
  * },
  * {
  *   "ButtonBearer/bearing-button-with-13-clicks": Object,
  *   "ButtonBearer/default": Object,
  *   "SimpleButton/default": Object,
  *   "SimpleButton/disabled": Object,
  *   "SimpleButton/with-100-clicks": Object,
  *   "StatelessButton/default": Object,
  *   "StatelessButton/disabled": Object,
  *   "StatelessButton/with-100-clicks": Object
  * }
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
module.exports = function(components, fixtures) {
  var componentFixtures = {};

  Object.keys(components).forEach((componentPath) => {
    var component = components[componentPath];

    // This is an implementation detail of Babel:
    // https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.skvldbg39
    // It looks like to be a "standard": https://github.com/esnext/es6-module-transpiler/issues/86 **for now**.
    if (component.__esModule) {
      var parts = componentPath.split('/');
      var componentName = parts[parts.length - 1];
      component = component[componentName] || component.default;
    }

    if (!component || !isReactClass(component)) {
      // Invalid Component provided.
      return;
    }

    componentFixtures[componentPath] = {
      class: component,
      fixtures: getFixturesForComponent(fixtures, componentPath)
    };

    // Allow users to browse components before creating fixtures
    if (!Object.keys(componentFixtures[componentPath].fixtures).length) {
      componentFixtures[componentPath].fixtures['auto-empty'] = {};
    }
  });

  return componentFixtures;
};

var isReactClass = function(component) {
  return typeof component === 'string' || typeof component === 'function';
}

var getFixturesForComponent = function(allFixtures, componentName) {
  var isFixtureOfComponent = new RegExp(componentName + '/([^/]+)$'),
      fixtures = {};

  Object.keys(allFixtures).forEach(function(fixturePath) {
    var match = fixturePath.match(isFixtureOfComponent);
    if (match) {
      fixtures[match[1]] = allFixtures[fixturePath];
    }
  });

  return fixtures;
};

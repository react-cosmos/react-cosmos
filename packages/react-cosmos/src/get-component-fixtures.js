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

const isReactClass = (component) =>
  typeof component === 'string' || typeof component === 'function';

const getFixturesForComponent = (allFixtures, componentName) => {
  const isFixtureOfComponent = new RegExp(`${componentName}/([^/]+)$`);
  const fixtures = {};

  Object.keys(allFixtures).forEach((fixturePath) => {
    const match = fixturePath.match(isFixtureOfComponent);
    if (match) {
      const fixture = allFixtures[fixturePath];
      // eslint-disable-next-line no-underscore-dangle
      fixtures[match[1]] = fixture.__esModule ? fixture.default : fixture;
    }
  });

  return fixtures;
};

module.exports = (components, fixtures) => {
  const componentFixtures = {};

  Object.keys(components).forEach((componentPath) => {
    let component = components[componentPath];

    // This is an implementation detail of Babel:
    // https://medium.com/@kentcdodds/misunderstanding-es6-modules-upgrading-babel-tears-and-a-solution-ad2d5ab93ce0#.skvldbg39
    // It looks like to be a "standard": https://github.com/esnext/es6-module-transpiler/issues/86 **for now**.
    // eslint-disable-next-line no-underscore-dangle
    if (component.__esModule) {
      const parts = componentPath.split('/');
      const componentName = parts[parts.length - 1];
      component = component[componentName] || component.default;
    }

    if (!component || !isReactClass(component)) {
      // Invalid Component provided.
      return;
    }

    componentFixtures[componentPath] = {
      class: component,
      fixtures: getFixturesForComponent(fixtures, componentPath),
    };

    // Allow users to browse components before creating fixtures
    if (!Object.keys(componentFixtures[componentPath].fixtures).length) {
      componentFixtures[componentPath].fixtures['auto-empty'] = {};
    }
  });

  return componentFixtures;
};

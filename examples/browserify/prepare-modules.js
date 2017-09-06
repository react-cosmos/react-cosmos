const prepareComponents = modules => {
  const components = {};
  Object.keys(modules).forEach(componentName => {
    if (componentName.indexOf('_') !== 0) {
      components[componentName] = modules[componentName].default;
    }
  });
  return components;
};

const prepareFixtures = (modules, components) => {
  const fixtures = {};
  Object.keys(components).forEach(componentName => {
    fixtures[componentName] = {};
    Object.keys(modules).forEach(fixtureName => {
      const componentPrefix = `./components/__fixtures__/${componentName}/`;
      if (fixtureName.indexOf(componentPrefix) === 0) {
        fixtures[componentName][fixtureName.slice(componentPrefix.length)] =
          modules[fixtureName].default;
      }
    });
  });
  return fixtures;
};

const componentModules = require('./components/**/*{.js,.jsx}', {
  mode: 'hash'
});
const fixtureModules = require('./components/__fixtures__/**/*.js', {
  mode: 'hash',
  resolve: ['path', 'strip-ext']
});

export const components = prepareComponents(componentModules);
export const fixtures = prepareFixtures(fixtureModules, components);

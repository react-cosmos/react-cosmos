const prepareComponents = modules => {
  const components = {};
  Object.keys(modules).forEach(componentName => {
    if (componentName.indexOf('_') !== 0) {
      components[componentName] = modules[componentName];
    }
  });
  return components;
};

const prepareFixtures = (modules, components) => {
  const fixtures = {};
  Object.keys(components).forEach(componentName => {
    fixtures[componentName] = {};
    Object.keys(modules).forEach(fixtureName => {
      const componentPrefix = `${componentName}/`;
      if (fixtureName.indexOf(componentPrefix) === 0) {
        fixtures[componentName][fixtureName.slice(componentPrefix.length)] =
          modules[fixtureName];
      }
    });
  });
  return fixtures;
};

const componentModules = require('../src/components/**/*{.js,.jsx}', { mode: 'hash' });
const fixtureModules = require('../src/components/__fixtures__/**/*.js', { mode: 'hash' });

export const components = prepareComponents(componentModules);
export const fixtures = prepareFixtures(fixtureModules, components);

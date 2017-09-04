const {
  default: importModule
} = require('react-cosmos-utils/lib/import-module');
const {
  default: importComponent
} = require('react-cosmos-utils/lib/import-component');

export const normalizeComponents = components =>
  Object.keys(components).reduce(
    (acc, next) => ({
      ...acc,
      [next]: importComponent(components[next], next)
    }),
    {}
  );

export const normalizeFixtures = fixtures =>
  Object.keys(fixtures).reduce((acc, next) => {
    const componentFixtures = fixtures[next];
    return {
      ...acc,
      [next]: Object.keys(componentFixtures).reduce(
        (acc2, next2) => ({
          ...acc2,
          [next2]: importModule(componentFixtures[next2])
        }),
        {}
      )
    };
  }, {});

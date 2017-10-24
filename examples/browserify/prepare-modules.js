import importModule from 'react-cosmos-utils/lib/import-module';
import { getComponents } from 'react-cosmos-voyager2/lib/client/get-components';

const fixtureModules = require('./components/__fixtures__/**/*.js', {
  mode: 'hash',
  resolve: ['path']
});

const normalizedFixtureModules = Object.keys(fixtureModules).reduce(
  (acc, relPath) => ({
    ...acc,
    [relToAbsPath(relPath)]: importModule(fixtureModules[relPath])
  }),
  {}
);

export const fixtures = prepareOldSchoolFixtures(normalizedFixtureModules);

function prepareOldSchoolFixtures(fixtureModules) {
  const fixtureFiles = Object.keys(fixtureModules).map(filePath => {
    return {
      filePath,
      components: []
    };
  });

  const components = getComponents({ fixtureFiles, fixtureModules });

  return getOldSchoolFixturesFromNewStyleComponents(components);
}

function relToAbsPath(relPath) {
  return relPath.slice(1);
}

function getOldSchoolFixturesFromNewStyleComponents(newStyleComponents) {
  const fixtures = {};

  newStyleComponents.forEach(c => {
    const componentName = getObjectPath(c);
    fixtures[componentName] = {};

    c.fixtures.forEach(f => {
      const fixtureName = getObjectPath(f);
      fixtures[componentName][fixtureName] = f.source;
    });
  });

  return fixtures;
}

function getObjectPath(obj) {
  return obj.namespace ? `${obj.namespace}/${obj.name}` : obj.name;
}

import { importModule } from 'react-cosmos-shared';
import { getComponents } from 'react-cosmos-voyager2/lib/client';

const { keys } = Object;

const rawFixtureModules = require('./components/__fixtures__/**/*.js', {
  mode: 'hash',
  resolve: ['path']
});

export function prepareOldSchoolFixtures() {
  const fixtureModules = getNormalizedModules(rawFixtureModules);
  const fixtureFiles = getFixtureFilesFromModules(fixtureModules);
  const components = getComponents({ fixtureFiles, fixtureModules });

  return getOldSchoolFixturesFromNewStyleComponents(components);
}

function getNormalizedModules(modules) {
  return keys(modules).reduce(
    (acc, relPath) => ({
      ...acc,
      [relToAbsPath(relPath)]: importModule(modules[relPath])
    }),
    {}
  );
}

function getFixtureFilesFromModules(modules) {
  return keys(modules).map(filePath => {
    return {
      filePath,
      components: []
    };
  });
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

function relToAbsPath(relPath) {
  return relPath.slice(1);
}

function getObjectPath(obj) {
  return obj.namespace ? `${obj.namespace}/${obj.name}` : obj.name;
}

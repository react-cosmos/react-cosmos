// @flow

import {
  getNormalizedFixtureModules,
  getOldSchoolFixturesFromNewStyleComponents
} from 'react-cosmos-shared';
import { getComponents } from 'react-cosmos-voyager2/client';

const { keys } = Object;

const fixtureModules = require('./components/__fixtures__/**/*.js', {
  mode: 'hash',
  resolve: ['path']
});

export function prepareOldSchoolFixtures() {
  const fixtureFiles = getFixtureFilesFromModules(fixtureModules);
  const components = getComponents({
    fixtureFiles,
    fixtureModules: getNormalizedFixtureModules(fixtureModules, fixtureFiles)
  });

  return getOldSchoolFixturesFromNewStyleComponents(components);
}

function getFixtureFilesFromModules(modules) {
  return keys(modules).map(filePath => {
    return {
      filePath,
      components: []
    };
  });
}

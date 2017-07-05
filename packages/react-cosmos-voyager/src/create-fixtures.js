import { argv } from 'yargs';
import { dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from './index';
import reduce from 'lodash.reduce';

module.exports = function startCreateFixtures() {
  createBlankFixturesForComponents(getComponentsWithoutFixtures());
};

function getComponentsWithoutFixtures() {
  const cosmosConfig = getCosmosConfig(argv.config);
  const { components, fixtures } = getFilePaths(cosmosConfig);
  return reduce(
    components,
    (final, componentPath, componentName) => {
      if (!fixtures[componentName] || Object.keys(fixtures[componentName]).length === 0) {
        final[componentName] = componentPath;
      }
      return final;
    },
    {}
  );
}

function createBlankFixturesForComponents(componentPaths) {
  const result = reduce(
    componentPaths,
    (final, path, componentName) => {
      const fixturesFolder = `${dirname(path)}/__fixtures__`;
      const fixture = `${fixturesFolder}/default.js`;
      try {
        ensureFixturesFolderExists(fixturesFolder);
        writeFileSync(
          fixture,
          `// Blank fixture created by cosmos-create-fixtures
    export default {};
    `,
          'utf8'
        );
        final.success.push({ componentName, fixture });
      } catch (err) {
        final.failure.push({ componentName, fixture });
      }
      return final;
    },
    {
      success: [],
      failure: []
    }
  );
  console.log(
    `[Cosmos] Create Fixtures Result: ${result.success.length}/${Object.keys(componentPaths)
      .length} Blank Fixtures Created`
  );
}

function ensureFixturesFolderExists(dirname) {
  if (existsSync(dirname)) {
    return;
  }
  mkdirSync(dirname);
}

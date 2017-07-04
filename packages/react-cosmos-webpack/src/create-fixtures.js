import { argv } from 'yargs';
import { dirname } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';
import reduce from 'lodash.reduce';

module.exports = function startCreateFixtures() {
  const cosmosConfig = getCosmosConfig(argv.config);
  const { components, fixtures } = getFilePaths(cosmosConfig);
  const noFixtures = reduce(
    components,
    (final, componentPath, componentName) => {
      if (!fixtures[componentName] || Object.keys(fixtures[componentName]).length === 0) {
        final[componentName] = componentPath;
      }
      return final;
    },
    {}
  );
  if (Object.keys(noFixtures).length === 0) {
    console.log('[Cosmos] No fixtures created. Every component has at least one fixture.');
  } else {
    createMissingFixtures(noFixtures);
  }
};

function createMissingFixtures(noFixtures) {
  const result = reduce(
    noFixtures,
    (final, path, componentName) => {
      const fixturesFolder = `${dirname(path)}/__fixtures__`;
      const fixture = `${fixturesFolder}/default.js`;
      try {
        ensureFixturesFolderExists(fixturesFolder);
        writeFileSync(
          fixture,
          `// Empty fixture created by cosmos-create-fixtures
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
    `[Cosmos] Create Fixtures Result: ${result.success.length}/${Object.keys(noFixtures)
      .length} Created`
  );
}

function ensureFixturesFolderExists(dirname) {
  if (existsSync(dirname)) {
    return;
  }
  mkdirSync(dirname);
}

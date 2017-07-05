import { argv } from 'yargs';
import { dirname, basename } from 'path';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from './index';
import reduce from 'lodash.reduce';
import find from 'lodash.find';
import fs from 'fs-extra';

module.exports = function startCreateFixtures() {
  const cosmosConfig = getCosmosConfig(argv.config);
  createBlankFixturesForComponents(getComponentsWithoutFixtures(cosmosConfig), cosmosConfig);
};

function getComponentsWithoutFixtures(cosmosConfig) {
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

function createBlankFixturesForComponents(componentPaths, cosmosConfig) {
  const result = reduce(
    componentPaths,
    (final, path, componentName) => {
      const fixturesFolder = getFixturesFolder(path, cosmosConfig.componentPaths);
      const fixture = `${fixturesFolder}/empty.js`;
      try {
        fs.ensureDirSync(fixturesFolder);
        fs.outputFileSync(
          fixture,
          `// Blank fixture created by cosmos-create-fixtures
    export default {};
    `
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

function getFixturesFolder(path, componentPaths) {
  if (basename(path).match(new RegExp(`${basename(basename(dirname(path)))}.(js|jsx)$`))) {
    //also works if you have one folder per component
    return `${dirname(path)}/__fixtures__`;
  }
  //By default, it looks for a __fixtures__ dir next to your components.
  //TODO: improve this approach to finding root of components folder
  const componentsFolder = find(componentPaths, p => path.indexOf(p) > -1);
  const relativeComponentFolder = path.replace(componentsFolder, '');
  return `${componentsFolder}/__fixtures__${relativeComponentFolder.substr(
    0,
    relativeComponentFolder.lastIndexOf('.')
  ) || relativeComponentFolder}`;
}

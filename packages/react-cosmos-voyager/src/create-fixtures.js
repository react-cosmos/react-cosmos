import { argv } from 'yargs';
import { dirname, basename } from 'path';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from './index';
import reduce from 'lodash.reduce';
import find from 'lodash.find';
import fs from 'fs-extra';

module.exports = function startCreateFixtures() {
  createBlankFixturesForComponents(getComponentsWithoutFixtures());
};

function getComponentsWithoutFixtures() {
  return getFilePaths(getCosmosConfig(argv.config)).missingFixtures
}

function createBlankFixturesForComponents(missingFixtures) {
  const result = reduce(
    missingFixtures,
    (final, fixturesFolder, componentName) => {
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
    `[Cosmos] Create Fixtures Result: ${result.success.length}/${Object.keys(missingFixtures)
      .length} Blank Fixtures Created`
  );
}

/**
 * returns folder to create fixtures in
 * @param  {string} componentPath Directory from cosmos.config componentPaths that the component
 *                                was found in. If using file paths, it the dir the file is in.
 * @param  {string} filePath      component file path
 * @param  {string} fixturesDir   __fixtures__ alternative from cosmos.config
 * @return {string}               folder to create fixture in
 */
export function getFixturesFolderForComponent(componentPath, filePath, fixturesDir) {
  if (basename(filePath).match(new RegExp(`${basename(dirname(filePath))}.(js|jsx)$`))) {
    // Component's parent folder name matches component name
    // This means the component is stored in its own folder
    // Fixture should be created in fixture folder next to component
    return `${dirname(filePath)}/${fixturesDir}`;
  }
  // create fixture in root level fixturesDir with matching dir structure as component's filePath
  return `${componentPath}/${fixturesDir}${getComponentFolderRelativeToComponentPath(filePath, componentPath)}`
}

function getComponentFolderRelativeToComponentPath(filePath, componentPath) {
  const relativeToComponentPath = filePath.replace(componentPath, '')
  // remove file extension
  return relativeToComponentPath.substr(
    0,
    relativeToComponentPath.lastIndexOf('.')
  ) || relativeToComponentPath;
}

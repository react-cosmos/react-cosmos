import { argv } from 'yargs';
import { dirname, basename, extname } from 'path';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from './index';
import reduce from 'lodash.reduce';
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
 * Returns fixtures dir path for a given component
 * @param  {string} componentPath Directory from cosmos.config componentPaths that the component
 *                                was found in. If using file paths, it is the dir the file is in.
 *                                e.g. C:/components
 * @param  {string} filePath      Component file path, e.g. C:/components/ComponentA.js
 * @param  {string} fixturesDir   __fixtures__ alternative from cosmos.config
 * @return {string}               Directory path to create fixture in
 */
export function getFixturesFolderForComponent(componentPath, filePath, fixturesDir) {
  if (basename(filePath, extname(filePath)) === basename(dirname(filePath))) {
    // Component's parent folder name matches component name
    // e.g. ComponentA/ComponentA.js
    // Fixture should be created in fixturesDir next to component
    return `${dirname(filePath)}/${fixturesDir}`;
  }
  // Create fixture in root level fixturesDir with matching dir structure as component's filePath
  return `${componentPath}/${fixturesDir}${getComponentFolderRelativeToComponentPath(componentPath, filePath)}`
}

/**
 * Given file path, e.g. `C:/components/FeatureA/ComponentA.js`
 * and componentPath, e.g. `C:/components`
 * returns `/FeatureA/ComponentA`
 * @param  {string} componentPath Directory from cosmos.config componentPaths that the component
 *                                was found in. If using file paths, it the dir the file is in.
 * @param  {string} filePath      component file path
 * @return {string}               Dir path of component relative to componentPath
 */
function getComponentFolderRelativeToComponentPath(componentPath, filePath) {
  return removeFileExtension(filePath.replace(componentPath, ''))
}

function removeFileExtension(filePath) {
  return filePath.replace(extname(filePath), '');
}

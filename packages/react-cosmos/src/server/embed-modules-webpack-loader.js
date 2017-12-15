// @flow

import path from 'path';
import { getCosmosConfig } from 'react-cosmos-config';
import { moduleExists } from 'react-cosmos-shared/lib/server';
import getFilePaths from 'react-cosmos-voyager';
import { findFixtureFiles } from 'react-cosmos-voyager2/lib/server';

import type { Config } from 'react-cosmos-config/src';
import type { FixtureFile } from 'react-cosmos-voyager2/src/types';

const { keys } = Object;

/**
 * Inject require calls in bundle for each component/fixture path and
 * require.context calls for each dir with user modules. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */
module.exports = async function embedModules(source: string) {
  const callback = this.async();

  const cosmosConfig: Config = getCosmosConfig();
  const { proxiesPath } = cosmosConfig;

  const {
    fixtureFiles,
    deprecatedComponentModules
  } = await getNormalizedModules(cosmosConfig);
  const fixturePaths = getFixturePaths(fixtureFiles);
  const fixtureModuleCalls = convertPathsToRequireCalls(fixturePaths);
  const componentModuleCallls = convertPathsToRequireCalls(
    keys(deprecatedComponentModules).map(c => deprecatedComponentModules[c])
  );

  const contexts = getUniqueDirsOfPaths(fixturePaths);
  contexts.forEach(dirPath => {
    // This ensures this loader is invalidated whenever a new component/fixture
    // file is created or renamed, which leads succesfully uda ...
    this.addDependency(dirPath);
  });

  const result = source
    .replace(/FIXTURE_MODULES/g, fixtureModuleCalls)
    .replace(/FIXTURE_FILES/g, JSON.stringify(fixtureFiles))
    .replace(/DEPRECATED_COMPONENT_MODULES/g, componentModuleCallls)
    .replace(
      /PROXIES/g,
      moduleExists(proxiesPath) ? convertPathToRequireCall(proxiesPath) : '[]'
    )
    .replace(/CONTEXTS/g, convertDirPathsToContextCalls(contexts));

  callback(null, result);
};

async function getNormalizedModules(cosmosConfig) {
  const { componentPaths } = cosmosConfig;

  if (componentPaths.length > 0) {
    console.warn(
      '[Cosmos] Using `componentPaths` config is deprecated. ' +
        'Please consider upgrading.'
    );

    const { components, fixtures } = getFilePaths(cosmosConfig);
    const fixtureFiles = [];

    // Convert old format to new format
    keys(fixtures).forEach(componentName => {
      keys(fixtures[componentName]).forEach(fixtureName => {
        fixtureFiles.push({
          filePath: fixtures[componentName][fixtureName],
          components: [
            {
              name: componentName,
              filePath: components[componentName]
            }
          ]
        });
      });
    });

    return { fixtureFiles, deprecatedComponentModules: components };
  }

  const fixtureFiles = await findFixtureFiles(cosmosConfig);

  return {
    fixtureFiles,
    deprecatedComponentModules: {}
  };
}

function getFixturePaths(files: Array<FixtureFile>): Array<string> {
  return files.map(file => file.filePath);
}

function convertPathsToRequireCalls(paths: Array<string>): string {
  const entries = paths.map(p => `'${p}':${convertPathToRequireCall(p)}`);

  return `{${entries.join(',')}}`;
}

function convertPathToRequireCall(p) {
  return `require('${p}')`;
}

function getUniqueDirsOfPaths(paths) {
  const dirs = new Set();
  paths.forEach(p => dirs.add(path.dirname(p)));

  return [...dirs];
}

function convertDirPathsToContextCalls(dirPaths) {
  return `[${dirPaths
    .map(dirPath => `require.context('${dirPath}',false,/\\.jsx?$/)`)
    .join(',')}]`;
}

// @flow

import path from 'path';
import getCosmosConfig from 'react-cosmos-config';
import moduleExists from 'react-cosmos-utils/lib/module-exists';
import { findFixtureFiles } from 'react-cosmos-voyager2/lib/server/find-fixture-files';

import type { FixtureFile } from 'react-cosmos-voyager2/src/types';

/**
 * TODO: Update docs
 * Inject require calls in bundle for each component/fixture path and
 * require.context calls for each dir with user modules. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */
module.exports = async function embedModules(source) {
  const callback = this.async();

  const cosmosConfig = getCosmosConfig();
  const { proxiesPath } = cosmosConfig;

  // TODO: New fs API coming fru
  const fixtureFiles = await findFixtureFiles({
    cwd: cosmosConfig.rootPath
  });
  const fixturePaths = getFixtureModules(fixtureFiles);
  const fixtureModuleCalls = convertPathsToRequireCalls(fixturePaths);

  const contexts = getUniqueDirsOfPaths(fixturePaths);
  contexts.forEach(dirPath => {
    // This ensures this loader is invalidated whenever a new component/fixture
    // file is created or renamed, which leads succesfully uda ...
    this.addDependency(dirPath);
  });
  const contextCalls = convertDirPathsToContextCalls(contexts);

  const result = source
    .replace(/FIXTURE_MODULES/g, fixtureModuleCalls)
    .replace(/FIXTURE_FILES/g, JSON.stringify(fixtureFiles))
    .replace(
      /PROXIES/g,
      moduleExists(proxiesPath) ? convertPathToRequireCall(proxiesPath) : '[]'
    )
    .replace(/CONTEXTS/g, contextCalls);

  callback(null, result);
};

function getFixtureModules(files: Array<FixtureFile>): Array<string> {
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
    .map(dirPath => `require.context('${dirPath}', false, /\\.jsx?$/)`)
    .join(',')}]`;
}

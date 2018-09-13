// @flow

import { relative } from 'path';
import { getCosmosConfig } from 'react-cosmos-config';
import { slash } from 'react-cosmos-shared/server';
import { findUserModulePaths } from 'react-cosmos-shared2/server';

import type { Config } from 'react-cosmos-flow/config';

// TODO: Make fixturesDir configurable
// See: https://github.com/react-cosmos/react-cosmos/issues/488
const FIXTURES_DIR = '__jsxfixtures__';

module.exports = async function embedModules(source: string) {
  const callback = this.async();

  const cosmosConfig: Config = getCosmosConfig();
  const { rootPath: rootDir } = cosmosConfig;

  const fixturesDir = FIXTURES_DIR;
  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
    rootDir,
    fixturesDir
  });

  const res = source
    .replace(
      '= __COSMOS_FIXTURES',
      `= ${genModuleMapStr({ paths: fixturePaths, rootDir })}`
    )
    .replace(
      '= __COSMOS_DECORATORS',
      `= ${genModuleMapStr({ paths: decoratorPaths, rootDir })}`
    );

  callback(null, res);
};

function genModuleMapStr({ paths, rootDir }) {
  if (paths.length === 0) {
    return '{}';
  }

  return `{${paths.map(path => getModuleStr({ path, rootDir })).join(', ')}\n}`;
}

function getModuleStr({ path, rootDir }) {
  const relPath = slash(relative(rootDir, path));

  return `
  '${relPath}': require('${path}').default`;

  // TODO: Support multiple named exports (as well as CJS modules)
  // return `
  // '${cleanPath}': {
  //   filePath: '${path}',
  //   exports: require('${path}')
  // }`;
}

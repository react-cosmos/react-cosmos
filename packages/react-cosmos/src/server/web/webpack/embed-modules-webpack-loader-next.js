// @flow

import { relative } from 'path';
import { getCosmosConfig } from 'react-cosmos-config';
import { slash } from 'react-cosmos-shared/server';
import { findUserModulePaths } from 'react-cosmos-shared2/server';
import { FIXTURES_DIR, FIXTURE_FILE_SUFFIX } from '../../shared/config-next';

import type { Config } from 'react-cosmos-flow/config';

module.exports = async function embedModules(source: string) {
  const callback = this.async();

  const cosmosConfig: Config = getCosmosConfig();
  const { rootPath: rootDir, watchDirs, globalImports } = cosmosConfig;

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers react-cosmos-voyager2
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  watchDirs.forEach(watchDir => this.addContextDependency(watchDir));

  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
    rootDir,
    fixturesDir: FIXTURES_DIR,
    fixtureFileSuffix: FIXTURE_FILE_SUFFIX
  });

  const res = source
    .replace(
      `/* __INJECT_GLOBAL_IMPORTS__ */`,
      globalImports.map(importPath => `require('${importPath}');`).join(`\n`)
    )
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

import path from 'path';
import { findUserModulePaths } from 'react-cosmos-shared2/server';
import { slash } from '../../shared/slash';
import { COSMOS_CONFIG, getRootDir } from '../../shared/config';

type WebpackLoaderContext = {
  async(): (error: Error | null, result: string | Buffer) => unknown;
  addContextDependency(directory: string): unknown;
};

module.exports = async function embedModules(source: string) {
  const webpackLoaderContext = (this as any) as WebpackLoaderContext;
  const callback = webpackLoaderContext.async();

  const cosmosConfig = COSMOS_CONFIG;
  const {
    watchDirs,
    globalImports,
    fixturesDir,
    fixtureFileSuffix
  } = COSMOS_CONFIG;
  const rootDir = getRootDir(cosmosConfig);

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers react-cosmos-voyager2
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  watchDirs.forEach(watchDir =>
    webpackLoaderContext.addContextDependency(watchDir)
  );

  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });

  const res = source
    .replace(
      `/* __INJECT_GLOBAL_IMPORTS__ */`,
      globalImports.map(importPath => `require('${importPath}');`).join(`\n`)
    )
    .replace(
      '= __COSMOS_FIXTURES',
      `= ${genModuleMapStr(fixturePaths, rootDir)}`
    )
    .replace(
      '= __COSMOS_DECORATORS',
      `= ${genModuleMapStr(decoratorPaths, rootDir)}`
    );

  callback(null, res);
};

function genModuleMapStr(paths: string[], rootDir: string) {
  if (paths.length === 0) {
    return '{}';
  }

  return `{${paths.map(p => getModuleStr(p, rootDir)).join(', ')}\n}`;
}

function getModuleStr(p: string, rootDir: string) {
  const relPath = slash(path.relative(rootDir, p));
  return `
  '${relPath}': require('${p}').default`;
}

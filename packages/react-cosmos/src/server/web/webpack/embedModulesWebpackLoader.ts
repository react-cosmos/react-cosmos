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
    fixturesDir,
    fixtureFileSuffix,
    watchDirs,
    globalImports
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

  const compiledModules = getCompiledModules({
    // TODO: Resolve global imports
    globalImports: globalImports
      .map(importPath => `require('${importPath}');`)
      .join(`\n`),
    fixtures: genModuleMapStr(fixturePaths, rootDir),
    decorators: genModuleMapStr(decoratorPaths, rootDir)
  });

  const res = source.replace('= __COSMOS_MODULES', `= ${compiledModules}`);
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

type ModulesTemplateArgs = {
  globalImports: string;
  fixtures: string;
  decorators: string;
};

function getCompiledModules({
  globalImports,
  fixtures,
  decorators
}: ModulesTemplateArgs) {
  return `(function() {
    // Global imports used to be added as bundle entry points but they were moved
    // here to make them hot reload-able, which works because the file that imports
    // this file knows how to accept hot reload patches
    ${globalImports}
  
    return {
      fixtures: ${fixtures},
      decorators: ${decorators}
    };
  })()`;
}

import path from 'path';
import { findUserModulePaths } from 'react-cosmos-shared2/server';
// FIXME: This module should be dom-agnostic
import { DomRendererConfig } from '../../dom';
import { slash } from './slash';
import { CosmosConfig, getRootDir } from './config';

// TODO: Maybe receive rendererConfig as an arg to make this module renderer
// platform (eg. DOM) agnostic
export async function injectRendererData(
  cosmosConfig: CosmosConfig,
  source: string
) {
  const { fixturesDir, fixtureFileSuffix, globalImports } = cosmosConfig;
  const rootDir = getRootDir(cosmosConfig);

  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });

  const compiledRendererData = getCompiledRendererData({
    // TODO: Resolve global imports
    globalImports: globalImports
      .map(importPath => `require('${importPath}');`)
      .join(`\n`),
    // Config options that are available inside the renderer bundle.
    // Warning: Must be serializable!
    rendererConfig: JSON.stringify(getRendererConfig(cosmosConfig)),
    fixtures: genModuleMapStr(fixturePaths, rootDir),
    decorators: genModuleMapStr(decoratorPaths, rootDir)
  });

  return source.replace('= __COSMOS_DATA', `= ${compiledRendererData}`);
}

function getRendererConfig({
  containerQuerySelector
}: CosmosConfig): DomRendererConfig {
  return { containerQuerySelector };
}

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

type RendererDataTemplateArgs = {
  globalImports: string;
  rendererConfig: string;
  fixtures: string;
  decorators: string;
};

function getCompiledRendererData({
  globalImports,
  rendererConfig,
  fixtures,
  decorators
}: RendererDataTemplateArgs) {
  return `(function() {
  // Global imports used to be added as bundle entry points but they were moved
  // here to make them hot reload-able, which works because the file that imports
  // this file knows how to accept hot reload patches
  ${globalImports}

  return {
    rendererConfig: ${rendererConfig},
    fixtures: ${fixtures},
    decorators: ${decorators}
  };
})()`;
}

import path from 'path';
import { slash } from '../slash';
import { CosmosConfig } from '../config';
import { findUserModulePaths } from './findPaths';

// Warning: Renderer config must be serializable!
export async function getCompiledUserDeps(
  cosmosConfig: CosmosConfig,
  rendererConfig: {}
) {
  const {
    rootDir,
    fixturesDir,
    fixtureFileSuffix,
    globalImports
  } = cosmosConfig;

  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });

  return getCompiledTemplate({
    // TODO: Resolve global imports
    globalImports: genGlobalRequires(globalImports),
    rendererConfig: JSON.stringify(rendererConfig),
    fixtures: genRequireMap(fixturePaths, rootDir),
    decorators: genRequireMap(decoratorPaths, rootDir)
  });
}

function genGlobalRequires(paths: string[]) {
  return paths.map(importPath => `require('${importPath}');`).join(`\n`);
}

function genRequireMap(paths: string[], rootDir: string) {
  if (paths.length === 0) {
    return '{}';
  }

  const requireRows = paths.map(p => {
    const relPath = slash(path.relative(rootDir, p));
    return `
  '${relPath}': require('${p}').default`;
  });

  return `{${requireRows.join(', ')}\n}`;
}

type TemplateArgs = {
  globalImports: string;
  rendererConfig: string;
  fixtures: string;
  decorators: string;
};

function getCompiledTemplate({
  globalImports,
  rendererConfig,
  fixtures,
  decorators
}: TemplateArgs) {
  return `// Keeping global imports here is superior to making them bundle entry points
// because this way they become hot-reloadable
${globalImports}

return {
  rendererConfig: ${rendererConfig},
  fixtures: ${fixtures},
  decorators: ${decorators}
};`;
}

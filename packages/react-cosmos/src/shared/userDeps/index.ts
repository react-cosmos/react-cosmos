import path from 'path';
import { slash } from '../slash';
import { CosmosConfig } from '../config';
import { findUserModulePaths } from './findPaths';
export {
  FILE_PATH_IGNORE,
  FIXTURE_PATTERNS,
  DECORATOR_PATTERNS
} from './findPaths';

export type StringifiedUserDeps = {
  globalImports: string;
  rendererConfig: string;
  fixtures: string;
  decorators: string;
};

// Warning: Renderer config must be serializable!
export async function getStringifiedUserDeps(
  cosmosConfig: CosmosConfig,
  rendererConfig: {}
): Promise<StringifiedUserDeps> {
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

  return {
    globalImports: genGlobalRequires(globalImports),
    rendererConfig: JSON.stringify(rendererConfig),
    fixtures: genRequireMap(fixturePaths, rootDir),
    decorators: genRequireMap(decoratorPaths, rootDir)
  };
}

function genGlobalRequires(paths: string[]) {
  if (paths.length === 0) {
    return '';
  }

  return [
    `// Keeping global imports here is superior to making them bundle entry points`,
    `// because this way they become hot-reloadable`,
    ...paths.map(importPath => `require('${importPath}');`)
  ].join(`\n`);
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

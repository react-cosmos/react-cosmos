import {
  userDepsImportMap,
  userDepsImportPath,
  UserDepsTemplateArgs,
} from './userDepsShared.js';

export function userDepsTemplate({
  globalImports,
  fixturePaths,
  decoratorPaths,
  rendererConfig,
  rootDir,
  relativeToDir,
  typeScript,
  importJsExtension,
}: UserDepsTemplateArgs) {
  const fixtures = userDepsImportMap(fixturePaths, rootDir, relativeToDir);
  const fixtureKeys = Object.keys(fixtures);

  const decorators = userDepsImportMap(decoratorPaths, rootDir, relativeToDir);
  const decoratorKeys = Object.keys(decorators);

  const rendererConfigStr = JSON.stringify(rendererConfig, null, 2);

  function ifTS(str: string) {
    return typeScript ? str : '';
  }

  function ext(importPath: string) {
    return importJsExtension
      ? importPath.replace(/\.tsx?$/, '.js')
      : importPath;
  }

  return `
// This file is automatically generated by Cosmos. Add it to .gitignore and
// only edit if you know what you're doing.${ifTS(`
import { RendererConfig, UserModuleWrappers } from 'react-cosmos-core';`)}

${globalImports
  .map(p => `import '${ext(userDepsImportPath(p, relativeToDir))}';`)
  .join(`\n`)}

${fixtureKeys
  .map((k, i) => `import * as fixture${i} from '${ext(fixtures[k])}';`)
  .join(`\n`)}

${decoratorKeys
  .map((k, i) => `import * as decorator${i} from '${ext(decorators[k])}';`)
  .join(`\n`)}

export const rendererConfig${ifTS(': RendererConfig')} = ${rendererConfigStr};

const fixtures = {
${fixtureKeys.map((k, i) => ` '${k}': { module: fixture${i} }`).join(`,\n`)}
};

const decorators = {
${decoratorKeys.map((k, i) => ` '${k}': { module: decorator${i} }`).join(`,\n`)}
};

export const moduleWrappers${ifTS(': UserModuleWrappers')} = {
  lazy: false,
  fixtures,
  decorators,
};
`.trimStart();
}

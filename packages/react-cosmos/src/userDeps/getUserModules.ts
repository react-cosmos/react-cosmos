import path from 'path';
import { ByPath, ReactDecorator, ReactFixtureExport } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { slash } from '../utils/slash.js';
import { findUserModulePaths } from './findUserModulePaths.js';

type UserModules = {
  fixtures: ByPath<ReactFixtureExport>;
  decorators: ByPath<ReactDecorator>;
};

export function getUserModules({
  rootDir,
  fixturesDir,
  fixtureFileSuffix,
  ignore,
}: CosmosConfig): UserModules {
  const { fixturePaths, decoratorPaths } = findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix,
    ignore,
  });
  return {
    fixtures: getDefaultExports<ReactFixtureExport>(fixturePaths, rootDir),
    decorators: getDefaultExports<ReactDecorator>(decoratorPaths, rootDir),
  };
}

function getDefaultExports<T>(paths: string[], rootDir: string) {
  const exportsByPath: Record<string, T> = {};
  paths.forEach(p => {
    // Converting to forward slashes on Windows is important because the
    // slashes are used for generating a sorted list of fixtures and
    // decorators.
    const relPath = slash(path.relative(rootDir, p));
    exportsByPath[relPath] = require(p).default;
  });
  return exportsByPath;
}

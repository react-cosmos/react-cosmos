import path from 'path';
import {
  ReactFixtureExportsByPath,
  ReactDecoratorsByPath,
  ReactDecorator,
  ReactFixtureExport
} from 'react-cosmos-shared2/react';
import { findUserModulePaths } from '.';
import { CosmosConfig } from '../../config';
import slash from 'slash';

type UserModules = {
  fixtureExportsByPath: ReactFixtureExportsByPath;
  decoratorsByPath: ReactDecoratorsByPath;
};

export async function getUserModules({
  rootDir,
  fixturesDir,
  fixtureFileSuffix
}: CosmosConfig): Promise<UserModules> {
  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });
  return {
    fixtureExportsByPath: getDefaultExportsByPath<ReactFixtureExport>(
      fixturePaths,
      rootDir
    ),
    decoratorsByPath: getDefaultExportsByPath<ReactDecorator>(
      decoratorPaths,
      rootDir
    )
  };
}

function getDefaultExportsByPath<T>(paths: string[], rootDir: string) {
  const exportsByPath: { [path: string]: T } = {};
  paths.forEach(p => {
    // Converting to forward slashes on Windows is important because the
    // slashes are used for generating a sorted list of fixtures and
    // decorators.
    const relPath = slash(path.relative(rootDir, p));
    exportsByPath[relPath] = require(p).default;
  });
  return exportsByPath;
}

import path from 'path';
import {
  ByPath,
  ReactDecoratorModule,
  ReactFixtureModule,
} from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { slash } from '../utils/slash.js';

type UserModules = {
  fixtures: ByPath<ReactFixtureModule>;
  decorators: ByPath<ReactDecoratorModule>;
};

export async function importUserModules({
  rootDir,
  fixturesDir,
  fixtureFileSuffix,
  ignore,
}: CosmosConfig): Promise<UserModules> {
  const { fixturePaths, decoratorPaths } = findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix,
    ignore,
  });
  return {
    fixtures: await importModules(fixturePaths, rootDir),
    decorators: await importModules(decoratorPaths, rootDir),
  };
}

async function importModules<T>(paths: string[], rootDir: string) {
  const modules = await Promise.all(
    paths.map(async p => {
      // Converting to forward slashes on Windows is important because the
      // slashes are used for generating a sorted list of fixtures and
      // decorators.
      const relPath = slash(path.relative(rootDir, p));
      return { relPath, module: await import(p) };
    })
  );

  return modules.reduce(
    (acc: Record<string, T>, { relPath, module }) => ({
      ...acc,
      [relPath]: module,
    }),
    {}
  );
}

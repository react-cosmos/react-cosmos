import {
  ByPath,
  ReactDecoratorModule,
  ReactFixtureModule,
} from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { importKeyPath } from '../userModules/shared.js';

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
  const { fixturePaths, decoratorPaths } = await findUserModulePaths({
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
      const relPath = importKeyPath(p, rootDir);
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

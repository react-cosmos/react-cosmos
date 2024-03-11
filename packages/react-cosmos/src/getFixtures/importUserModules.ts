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

export function importUserModules({
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
    fixtures: importModules(fixturePaths, rootDir),
    decorators: importModules(decoratorPaths, rootDir),
  };
}

function importModules<T>(paths: string[], rootDir: string) {
  const modules = paths.map(p => {
    const relPath = importKeyPath(p, rootDir);
    return { relPath, module: require(p) };
  });

  return modules.reduce(
    (acc: Record<string, T>, { relPath, module }) => ({
      ...acc,
      [relPath]: module,
    }),
    {}
  );
}

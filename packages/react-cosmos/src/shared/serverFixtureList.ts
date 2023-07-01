import { FixtureList } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { importKeyPath } from '../userModules/shared.js';

let fixtureListCache: FixtureList | null = null;

export function getServerFixtureList(cosmosConfig: CosmosConfig) {
  if (!fixtureListCache) {
    const { fixturePaths } = findUserModulePaths(cosmosConfig);
    fixtureListCache = createFixtureList(cosmosConfig.rootDir, fixturePaths);
  }

  return fixtureListCache;
}

export function updateFixtureListCache(
  rootDir: string,
  fixturePaths: string[]
) {
  fixtureListCache = createFixtureList(rootDir, fixturePaths);
}

function createFixtureList(rootDir: string, fixturePaths: string[]) {
  return fixturePaths.reduce<FixtureList>(
    (acc, fixturePath) => ({
      ...acc,
      [importKeyPath(fixturePath, rootDir)]: { type: 'single' },
    }),
    {}
  );
}

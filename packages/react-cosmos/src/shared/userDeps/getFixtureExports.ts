import path from 'path';
import { ReactFixturesByPath } from 'react-cosmos-shared2/react';
import { CosmosConfig } from '../../config';
import { slash } from '../slash';
import { findUserModulePaths } from './findUserModulePaths';

export async function getFixtureExports(
  cosmosConfig: CosmosConfig
): Promise<ReactFixturesByPath> {
  const { rootDir, fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const { fixturePaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });

  const reactFixturesByPath: ReactFixturesByPath = {};
  fixturePaths.forEach(fixturePath => {
    const relPath = slash(path.relative(rootDir, fixturePath));
    reactFixturesByPath[relPath] = require(fixturePath).default;
  });

  return reactFixturesByPath;
}

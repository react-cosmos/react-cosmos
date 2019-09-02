import path from 'path';
import { ReactFixtureExportsByPath } from 'react-cosmos-shared2/react';
import { findUserModulePaths } from '.';
import { CosmosConfig } from '../../config';
import { slash } from '../slash';

export async function getFixtureExportsByPath({
  rootDir,
  fixturesDir,
  fixtureFileSuffix
}: CosmosConfig): Promise<ReactFixtureExportsByPath> {
  const { fixturePaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });

  const reactFixturesByPath: ReactFixtureExportsByPath = {};
  fixturePaths.forEach(fixturePath => {
    const relPath = slash(path.relative(rootDir, fixturePath));
    reactFixturesByPath[relPath] = require(fixturePath).default;
  });

  return reactFixturesByPath;
}

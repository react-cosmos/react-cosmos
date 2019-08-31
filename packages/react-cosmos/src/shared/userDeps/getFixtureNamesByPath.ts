import { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import * as shared from 'react-cosmos-shared2/react';
import { CosmosConfig } from '../../config';
import { getFixtureExports } from './getFixtureExports';

export async function getFixtureNamesByPath(
  cosmosConfig: CosmosConfig
): Promise<FixtureNamesByPath> {
  const fixtureExports = await getFixtureExports(cosmosConfig);
  return shared.getFixtureNamesByPath(fixtureExports);
}

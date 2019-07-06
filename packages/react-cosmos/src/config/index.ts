import { requireModule } from '../shared/fs';
import { CosmosConfig } from './shared';
import { createCosmosConfig } from './createCosmosConfig';
import { getCosmosConfigPath } from './cosmosConfigPath';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type CosmosConfig = CosmosConfig;

export { createCosmosConfig } from './createCosmosConfig';
export { resolvePath, resolveModule } from './resolve';

export function getCosmosConfig() {
  const cosmosConfigPath = getCosmosConfigPath();
  const cosmosConfigInput = requireModule(cosmosConfigPath) || {};
  return createCosmosConfig(cosmosConfigInput);
}

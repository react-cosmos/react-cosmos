import { requireFileAtPath } from './fs';
import { createCosmosConfig } from './createCosmosConfig';
import { getCosmosConfigPath } from './cosmosConfigPath';

export { CosmosConfig } from './shared';
export { createCosmosConfig } from './createCosmosConfig';
export { resolvePath, resolveModule } from './resolve';

export function getCosmosConfig() {
  const cosmosConfigPath = getCosmosConfigPath();
  const cosmosConfigInput = requireFileAtPath(cosmosConfigPath) || {};
  return createCosmosConfig(cosmosConfigInput);
}

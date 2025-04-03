import { CosmosMode } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform, CosmosServerPlugin } from '../cosmosPlugin/types.js';

type Args = {
  cosmosConfig: CosmosConfig;
  serverPlugins: CosmosServerPlugin[];
  mode: CosmosMode;
  platform: CosmosPlatform;
};
export async function applyServerConfigPlugins({
  cosmosConfig,
  serverPlugins,
  mode,
  platform,
}: Args) {
  for (const plugin of serverPlugins) {
    if (plugin.config) {
      try {
        cosmosConfig = await plugin.config({ cosmosConfig, mode, platform });
      } catch (err) {
        console.log(`[Cosmos][plugin:${plugin.name}] Config hook failed`);
        throw err;
      }
    }
  }

  return cosmosConfig;
}

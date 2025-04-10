import { CosmosMode } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform, CosmosServerPlugin } from '../cosmosPlugin/types.js';

type Args = {
  config: CosmosConfig;
  serverPlugins: CosmosServerPlugin[];
  mode: CosmosMode;
  platform: CosmosPlatform;
};
export async function applyServerConfigPlugins({
  config,
  serverPlugins,
  mode,
  platform,
}: Args) {
  for (const plugin of serverPlugins) {
    if (plugin.config) {
      try {
        config = await plugin.config({ config, mode, platform });
      } catch (err) {
        console.log(`[Cosmos][plugin:${plugin.name}] Config hook failed`);
        throw err;
      }
    }
  }

  return config;
}

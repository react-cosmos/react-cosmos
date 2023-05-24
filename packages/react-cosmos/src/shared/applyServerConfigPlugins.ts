import { CosmosCommand } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform, CosmosServerPlugin } from '../cosmosPlugin/types.js';

type Args = {
  cosmosConfig: CosmosConfig;
  serverPlugins: CosmosServerPlugin[];
  command: CosmosCommand;
  platform: CosmosPlatform;
};
export async function applyServerConfigPlugins({
  cosmosConfig,
  serverPlugins,
  command,
  platform,
}: Args) {
  for (const plugin of serverPlugins) {
    if (plugin.config) {
      try {
        cosmosConfig = await plugin.config({ cosmosConfig, command, platform });
      } catch (err) {
        console.log(`[Cosmos][plugin:${plugin.name}] Config hook failed`);
        throw err;
      }
    }
  }

  return cosmosConfig;
}

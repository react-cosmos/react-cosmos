import { CosmosCommand } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosBuildPlugin, CosmosPlatform } from '../cosmosPlugin/types.js';

type Args = {
  cosmosConfig: CosmosConfig;
  buildPlugins: CosmosBuildPlugin[];
  command: CosmosCommand;
  platform: CosmosPlatform;
};
export async function applyConfigPlugins({
  cosmosConfig,
  buildPlugins,
  command,
  platform,
}: Args) {
  for (const plugin of buildPlugins) {
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

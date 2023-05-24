import { CosmosPluginConfig } from 'react-cosmos-core';
import { coreServerPlugins } from '../corePlugins/index.js';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { importServerPlugins } from './importServerPlugins.js';

type Args = {
  cosmosConfig: CosmosConfig;
  pluginConfigs: CosmosPluginConfig[];
};
export async function getServerPlugins({ cosmosConfig, pluginConfigs }: Args) {
  const userPlugins = await importServerPlugins(
    pluginConfigs,
    cosmosConfig.rootDir
  );

  return [...coreServerPlugins, ...userPlugins];
}

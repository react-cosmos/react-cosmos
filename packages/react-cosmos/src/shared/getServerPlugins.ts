import { CosmosPluginConfig } from 'react-cosmos-core';
import { coreServerPlugins } from '../corePlugins/index.js';
import { importServerPlugins } from './importServerPlugins.js';

export async function getServerPlugins(
  pluginConfigs: CosmosPluginConfig[],
  rootDir: string
) {
  const userPlugins = await importServerPlugins(pluginConfigs, rootDir);
  return [...coreServerPlugins, ...userPlugins];
}

import { CosmosPluginConfig } from 'react-cosmos-core';
import { coreBuildPlugins } from '../corePlugins/index.js';
import { importBuildPlugins } from './importBuildPlugins.js';

export async function getBuildPlugins(
  pluginConfigs: CosmosPluginConfig[],
  rootDir: string
) {
  const userPlugins = await importBuildPlugins(pluginConfigs, rootDir);
  return [...coreBuildPlugins, ...userPlugins];
}

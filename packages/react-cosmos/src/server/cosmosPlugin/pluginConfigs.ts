import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs.js';
import { readCosmosPluginConfig } from './readCosmosPluginConfig.js';

export async function getPluginConfigs(
  cosmosConfig: CosmosConfig
): Promise<CosmosPluginConfig[]> {
  const { rootDir, disablePlugins, plugins, exportPath } = cosmosConfig;

  if (disablePlugins) return [];

  const moduleConfigs = await Promise.all(
    plugins.map(pluginId => readCosmosPluginConfig(rootDir, pluginId))
  );

  const localConfigs = await findCosmosPluginConfigs({
    rootDir,
    ignore: [`${exportPath}/**`],
  });

  return [...moduleConfigs, ...localConfigs];
}

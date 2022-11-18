import { CosmosConfig } from '../cosmosConfig/types.js';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs.js';
import { readCosmosPluginConfig } from './readCosmosPluginConfig.js';
import { CosmosPluginConfig } from './types.js';

export function getPluginConfigs(cosmosConfig: CosmosConfig) {
  const { rootDir, disablePlugins, plugins, exportPath } = cosmosConfig;

  if (disablePlugins) return [];

  const moduleConfigs = plugins.reduce(
    (paths: CosmosPluginConfig[], pluginId) => [
      ...paths,
      readCosmosPluginConfig(rootDir, pluginId),
    ],
    []
  );

  const localConfigs = findCosmosPluginConfigs({
    rootDir,
    ignore: [`${exportPath}/**`],
  });

  return [...moduleConfigs, ...localConfigs];
}

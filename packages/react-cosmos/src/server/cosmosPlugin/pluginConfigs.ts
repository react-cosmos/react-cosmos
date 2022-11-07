import { CosmosConfig } from '../cosmosConfig/types';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs';
import { readCosmosPluginConfig } from './readCosmosPluginConfig';
import { CosmosPluginConfig } from './types';

// TODO: Refactor
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

import {
  CosmosPluginConfig,
  getCosmosPluginConfigs,
  getCosmosPluginConfig,
} from 'react-cosmos-plugin';
import { CosmosConfig } from 'react-cosmos-shared2/cosmosConfig';

export function getPluginConfigs(cosmosConfig: CosmosConfig) {
  const { rootDir, disablePlugins, plugins, exportPath } = cosmosConfig;
  if (disablePlugins) return [];

  const moduleConfigs = plugins.reduce(
    (paths: CosmosPluginConfig[], pluginPath) => [
      ...paths,
      getCosmosPluginConfig(rootDir, pluginPath),
    ],
    []
  );

  const localConfigs = getCosmosPluginConfigs({
    rootDir,
    ignore: [`${exportPath}/**`],
  });

  return [...moduleConfigs, ...localConfigs];
}

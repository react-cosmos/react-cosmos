import { CosmosConfig } from '../cosmosConfig/types';
import {
  getCosmosPluginConfig,
  getCosmosPluginConfigs,
} from './getCosmosPluginConfigs';
import { CosmosPluginConfig } from './types';

// TODO: Refactor
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

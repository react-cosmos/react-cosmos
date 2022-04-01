import { CosmosConfig } from '../cosmosConfig/types.js';
import {
  getCosmosPluginConfig,
  getCosmosPluginConfigs,
} from './getCosmosPluginConfigs.js';
import { CosmosPluginConfig } from './types.js';

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

import { getCosmosPluginConfigs } from 'react-cosmos-plugin';
import { CosmosConfig } from '../config/shared';

export function getPluginConfigs(cosmosConfig: CosmosConfig) {
  const { rootDir, disablePlugins, exportPath } = cosmosConfig;
  return disablePlugins
    ? []
    : getCosmosPluginConfigs(rootDir, [`${exportPath}/**`]);
}

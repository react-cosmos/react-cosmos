import { getCosmosPluginConfigs } from 'react-cosmos-plugin';
import { CosmosConfig } from 'react-cosmos-shared2/cosmosConfig';

export function getPluginConfigs(cosmosConfig: CosmosConfig) {
  const { rootDir, disablePlugins, exportPath } = cosmosConfig;
  return disablePlugins
    ? []
    : getCosmosPluginConfigs(rootDir, [`${exportPath}/**`]);
}

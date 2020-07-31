import { getCosmosPluginConfigs } from 'react-cosmos-plugin';
import { CosmosConfig } from '../config';

export function getPluginConfigs(cosmosConfig: CosmosConfig) {
  const { rootDir, exportPath } = cosmosConfig;
  return getCosmosPluginConfigs(rootDir, [`${exportPath}/**`]);
}

import path from 'node:path';
import { CosmosConfig, CosmosConfigPluginArgs } from 'react-cosmos';
import { RENDERER_FILENAME } from './webpackConfig/constants.js';

export async function webpackConfigPlugin({
  cosmosConfig,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  if (cosmosConfig.rendererUrl) {
    return cosmosConfig;
  }

  return {
    ...cosmosConfig,
    rendererUrl: path.join(cosmosConfig.publicUrl, RENDERER_FILENAME),
  };
}

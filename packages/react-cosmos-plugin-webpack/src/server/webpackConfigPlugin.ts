import path from 'node:path';
import { CosmosConfig, CosmosConfigPluginArgs } from 'react-cosmos';
import { RENDERER_FILENAME } from './webpackConfig/constants.js';

export async function webpackConfigPlugin({
  config,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  if (config.rendererUrl) {
    return config;
  }

  return {
    ...config,
    rendererUrl: path.join(config.publicUrl, RENDERER_FILENAME),
  };
}

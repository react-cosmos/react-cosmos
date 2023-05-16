import { CosmosConfig, CosmosConfigPluginArgs } from 'react-cosmos';
import { RENDERER_FILENAME } from './webpackConfig/constants.js';

export async function webpackConfigPlugin({
  cosmosConfig,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  const { rendererUrl } = cosmosConfig;
  if (rendererUrl) {
    return cosmosConfig;
  }

  return {
    ...cosmosConfig,
    // TODO: Should cosmosConfig.publicUrl be used here?
    rendererUrl: `./${RENDERER_FILENAME}`,
  };
}

import {
  CosmosConfig,
  CosmosConfigPluginArgs,
  findNextAvailablePort,
} from 'react-cosmos';
import { RENDERER_FILENAME } from './constants.js';
import { getCosmosVitePort } from './createCosmosViteConfig.js';

export async function viteConfigPlugin({
  cosmosConfig,
  command,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  const { rendererUrl } = cosmosConfig;
  if (rendererUrl) {
    return cosmosConfig;
  }

  if (command === 'export') {
    return {
      ...cosmosConfig,
      rendererUrl: `./${RENDERER_FILENAME}`,
    };
  }

  const cosmosViteConfig = cosmosConfig.vite || {};
  const port = await findNextAvailablePort(
    getCosmosVitePort(cosmosViteConfig),
    cosmosConfig.portRetries
  );

  return {
    ...cosmosConfig,
    rendererUrl: `http://localhost:${port}`,
    vite: {
      ...cosmosViteConfig,
      port: port,
    },
  };
}

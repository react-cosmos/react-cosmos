import path from 'node:path';
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
  if (cosmosConfig.rendererUrl) {
    return cosmosConfig;
  }

  if (command === 'export') {
    return {
      ...cosmosConfig,
      rendererUrl: path.join(cosmosConfig.publicUrl, RENDERER_FILENAME),
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

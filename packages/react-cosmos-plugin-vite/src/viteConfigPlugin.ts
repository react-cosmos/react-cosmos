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
  mode,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  if (cosmosConfig.rendererUrl) {
    return cosmosConfig;
  }

  if (mode === 'export') {
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

  const protocol = cosmosConfig.https ? 'https' : 'http';
  return {
    ...cosmosConfig,
    rendererUrl: `${protocol}://localhost:${port}`,
    vite: {
      ...cosmosViteConfig,
      port: port,
    },
  };
}

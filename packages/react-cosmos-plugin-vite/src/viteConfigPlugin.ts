import path from 'node:path';
import {
  CosmosConfig,
  CosmosConfigPluginArgs,
  findNextAvailablePort,
} from 'react-cosmos';
import { RENDERER_FILENAME } from './constants.js';
import { getCosmosVitePort } from './createCosmosViteConfig.js';

export async function viteConfigPlugin({
  config,
  mode,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  if (config.rendererUrl) {
    return config;
  }

  if (mode === 'export') {
    return {
      ...config,
      rendererUrl: path.join(config.publicUrl, RENDERER_FILENAME),
    };
  }

  const cosmosViteConfig = config.vite || {};
  const port = await findNextAvailablePort(
    getCosmosVitePort(cosmosViteConfig),
    config.portRetries
  );

  const protocol = config.https ? 'https' : 'http';
  return {
    ...config,
    rendererUrl: `${protocol}://localhost:${port}`,
    vite: {
      ...cosmosViteConfig,
      port: port,
    },
  };
}

import {
  CosmosConfig,
  CosmosConfigPluginArgs,
  findNextAvailablePort,
} from 'react-cosmos';
import { DEFAULT_VITE_PORT } from './createViteCosmosConfig.js';

export async function viteConfigPlugin({
  cosmosConfig,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  const { rendererUrl } = cosmosConfig;
  if (rendererUrl) {
    return cosmosConfig;
  }

  const port = await findNextAvailablePort(
    DEFAULT_VITE_PORT,
    cosmosConfig.portRetries
  );

  return {
    ...cosmosConfig,
    rendererUrl: `http://localhost:${port}`,
    vite: {
      ...(cosmosConfig.vite || {}),
      port: port,
    },
  };
}

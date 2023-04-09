import {
  CosmosConfig,
  CosmosConfigPluginArgs,
  findNextAvailablePort,
} from 'react-cosmos/server.js';
import { createViteCosmosConfig } from './createViteCosmosConfig.js';

export async function viteConfigPluginHook({
  cosmosConfig,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  const { rendererUrl } = cosmosConfig;
  if (rendererUrl) {
    return cosmosConfig;
  }

  const viteCosmosConfig = createViteCosmosConfig(cosmosConfig);
  const port = await findNextAvailablePort(
    viteCosmosConfig.port,
    cosmosConfig.portRetries
  );

  return {
    ...cosmosConfig,
    rendererUrl: `http://localhost:${port}`,
    vite: {
      ...viteCosmosConfig,
      port: port,
    },
  };
}

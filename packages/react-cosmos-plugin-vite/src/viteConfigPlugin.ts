import path from 'node:path';
import type { CosmosConfig, CosmosConfigPluginArgs } from 'react-cosmos';
import { RENDERER_FILENAME } from './constants.js';
import { getCosmosVitePort } from './createCosmosViteConfig.js';

export async function viteConfigPlugin({
  config,
  mode,
}: CosmosConfigPluginArgs): Promise<CosmosConfig> {
  if (config.rendererUrl) {
    return config;
  }

  // The renderer gets its own Vite server (and origin) only when a port is
  // explicitly set for it
  const port = getCosmosVitePort(config);
  if (mode === 'dev' && port !== null) {
    const protocol = config.https ? 'https' : 'http';
    return {
      ...config,
      rendererUrl: `${protocol}://localhost:${port}`,
    };
  }

  // By default the renderer is served by the Cosmos server in dev mode, at
  // the same path where it ends up in a static export
  return {
    ...config,
    rendererUrl: path.join(config.publicUrl, RENDERER_FILENAME),
  };
}

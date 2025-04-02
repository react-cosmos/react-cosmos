import { pickRendererUrl } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getServerAddress } from './serverAddress.js';

export function getRemoteRendererUrl(config: CosmosConfig) {
  const rendererUrl = pickRendererUrl(config.rendererUrl, 'dev');
  return rendererUrl ? buildUrl(config, rendererUrl).toString() : null;
}

// Renderer URL can be absolute or relative, depending on whether the renderer
// is running on the same host/port as the Cosmos UI.
function buildUrl(config: CosmosConfig, rendererUrl: string) {
  const serverAddress = getServerAddress(config);
  try {
    const url = new URL(rendererUrl);
    url.host = serverAddress;
    return url;
  } catch {
    const protocol = config.https ? 'https' : 'http';
    return new URL(rendererUrl, `${protocol}://${serverAddress}`);
  }
}

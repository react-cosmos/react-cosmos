import { createRendererUrl, pickRendererUrl } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getServerAddress, getServerHost } from './serverAddress.js';

export function getRemoteRendererUrl(config: CosmosConfig) {
  const rendererUrl = pickRendererUrl(config.rendererUrl, 'dev');
  return rendererUrl
    ? fullServerUrl(config, createRendererUrl(rendererUrl)).toString()
    : null;
}

function fullServerUrl(config: CosmosConfig, rendererUrl: string) {
  // Renderer URL can be absolute or relative, depending on whether the renderer
  // is running on the same host/port as the Cosmos UI.
  try {
    const url = new URL(rendererUrl);
    url.hostname = getServerHost(config);
    return url;
  } catch {
    const protocol = config.https ? 'https' : 'http';
    return new URL(rendererUrl, `${protocol}://${getServerAddress(config)}`);
  }
}

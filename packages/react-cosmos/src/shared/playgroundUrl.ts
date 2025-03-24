import { CosmosConfig } from '../cosmosConfig/types.js';

export function getPlaygroundUrl(cosmosConfig: CosmosConfig) {
  const { host, port, https: httpsEnabled } = cosmosConfig;

  const protocol = httpsEnabled ? 'https' : 'http';
  const hostDisplay = host || 'localhost';

  return `${protocol}://${hostDisplay}:${port}`;
}

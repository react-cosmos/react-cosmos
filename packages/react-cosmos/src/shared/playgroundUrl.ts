import { CosmosConfig } from '../cosmosConfig/types.js';

export function getPlaygroundUrl(cosmosConfig: CosmosConfig) {
  const { hostname, port, https: httpsEnabled } = cosmosConfig;

  const protocol = httpsEnabled ? 'https' : 'http';
  const hostnameDisplay = hostname || 'localhost';

  return `${protocol}://${hostnameDisplay}:${port}`;
}

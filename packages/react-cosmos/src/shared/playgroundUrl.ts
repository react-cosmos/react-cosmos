import { CosmosConfig } from '../cosmosConfig/types.js';
import { getServerHost } from './serverAddress.js';

export function getPlaygroundUrls(config: CosmosConfig) {
  const protocol = config.https ? 'https' : 'http';

  if (config.host) {
    return [`${protocol}://${config.host}:${config.port}`];
  }

  return [
    `${protocol}://localhost:${config.port}`,
    `${protocol}://${getServerHost(config)}:${config.port}`,
  ];
}

import { CosmosConfig } from '../cosmosConfig/types.js';
import { getServerAddress } from './serverAddress.js';

export function getWebSocketUrl(config: CosmosConfig) {
  const protocol = config.https ? 'wss' : 'ws';
  return `${protocol}://${getServerAddress(config)}`;
}

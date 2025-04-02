import * as os from 'node:os';
import { CosmosConfig } from '../cosmosConfig/types.js';

export function getWebSocketUrl(config: CosmosConfig) {
  const protocol = config.https ? 'wss' : 'ws';
  const host = config.host ?? getIpAddress();
  return `${protocol}://${host}:${config.port}`;
}

function getIpAddress() {
  const nets = os.networkInterfaces();

  for (const name of Object.keys(nets)) {
    if (nets[name]) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
        if (net.family === familyV4Value && !net.internal) {
          return net.address;
        }
      }
    }
  }

  return '127.0.0.1';
}

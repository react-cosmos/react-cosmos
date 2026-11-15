import http from 'http';
import https from 'https';
import type { CosmosConfig } from '../cosmosConfig/types.js';
import { getHttpsCreds } from './httpsCreds.js';
import { listenOnAvailablePort } from './listenOnAvailablePort.js';

export async function createHttpServer(config: CosmosConfig) {
  const server = config.https
    ? https.createServer(await getHttpsCreds(config))
    : http.createServer();

  // Returns the port the server ended up listening on, which can differ from
  // the one in the config
  async function start() {
    return listenOnAvailablePort(server, config);
  }

  async function stop() {
    await new Promise(resolve => server.close(resolve));
  }

  return { server, start, stop };
}

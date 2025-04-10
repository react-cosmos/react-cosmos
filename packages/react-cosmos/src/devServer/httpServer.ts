import http from 'http';
import https from 'https';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getHttpsCreds } from './httpsCreds.js';

type RequestListener = (
  request: http.IncomingMessage,
  response: http.ServerResponse
) => void;

export async function createHttpServer(
  config: CosmosConfig,
  requestListener: RequestListener
) {
  const server = config.https
    ? https.createServer(await getHttpsCreds(config), requestListener)
    : http.createServer(requestListener);

  async function start() {
    await new Promise<void>(resolve => {
      if (config.host === null) {
        server.listen(config.port, resolve);
      } else {
        server.listen(config.port, config.host, resolve);
      }
    });
  }

  async function stop() {
    await new Promise(resolve => server.close(resolve));
  }

  return { server, start, stop };
}

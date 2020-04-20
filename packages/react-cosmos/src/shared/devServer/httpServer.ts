import http from 'http';
import { CosmosConfig } from '../../config';

type RequestListener = (
  request: http.IncomingMessage,
  response: http.ServerResponse
) => void;

export function createHttpServer(
  cosmosConfig: CosmosConfig,
  requestListener: RequestListener
) {
  const { port, hostname } = cosmosConfig;
  const server = http.createServer(requestListener);

  async function start() {
    await new Promise(resolve => {
      if (hostname === null) {
        server.listen(port, resolve);
      } else {
        server.listen(port, hostname, resolve);
      }
    });

    const hostnameDisplay = hostname || 'localhost';
    console.log(`[Cosmos] See you at http://${hostnameDisplay}:${port}`);
  }

  async function stop() {
    await new Promise(resolve => server.close(resolve));
  }

  return { server, start, stop };
}

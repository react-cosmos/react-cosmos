import http from 'http';
import promisify from 'util.promisify';
import { CosmosConfig } from '../config';

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
    const listen = promisify(server.listen.bind(server));
    await listen(port, hostname);

    const hostnameDisplay = hostname || 'localhost';
    console.log(`[Cosmos] See you at http://${hostnameDisplay}:${port}`);
  }

  async function stop() {
    await promisify(server.close.bind(server))();
  }

  return { server, start, stop };
}

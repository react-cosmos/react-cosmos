import net from 'net';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';

export const portRetryServerPlugin: CosmosServerPlugin = {
  name: 'portRetry',

  async config({ cosmosConfig }) {
    const { port, portRetries } = cosmosConfig;
    return {
      ...cosmosConfig,
      port: portRetries ? await findNextAvailablePort(port, portRetries) : port,
    };
  },
};

// Inspired by https://stackoverflow.com/q/19129570
async function findNextAvailablePort(port: number, retries: number) {
  return new Promise<number>((resolve, reject) => {
    const socket = new net.Socket();

    socket.on('connect', () => {
      console.log(`[Cosmos] Port ${port} already in use, trying next...`);
      if (retries > 0) {
        socket.destroy();
        resolve(findNextAvailablePort(port + 1, retries - 1));
      } else {
        reject(`No available port found after ${retries} retries`);
      }
    });

    socket.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ECONNREFUSED') resolve(port);
      else reject(error);
    });

    socket.setTimeout(400);
    socket.on('timeout', () => {
      socket.destroy();
      resolve(port);
    });

    socket.connect(port, '0.0.0.0');
  });
}

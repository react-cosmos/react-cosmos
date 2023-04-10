import net from 'net';

// Inspired by https://stackoverflow.com/q/19129570
export async function findNextAvailablePort(
  port: number,
  retries: number,
  retriesLeft = retries
) {
  return new Promise<number>((resolve, reject) => {
    const socket = new net.Socket();

    socket.on('connect', () => {
      console.log(`[Cosmos] Port ${port} already in use, trying next...`);
      if (retriesLeft > 0) {
        socket.destroy();
        resolve(findNextAvailablePort(port + 1, retries, retriesLeft - 1));
      } else {
        reject(`No available port found after ${retries} retries.`);
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

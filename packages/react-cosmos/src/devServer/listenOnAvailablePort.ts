import net from 'node:net';
import { isUnsafePort } from './unsafePorts.js';

type Args = {
  // Port 0 lets the OS pick any free port
  port: number;
  // How many subsequent ports to try when the requested one isn't available.
  // With 0 retries the requested port is used or an error is thrown.
  portRetries: number;
  // Null listens on all addresses
  host: null | string;
};

const MAX_PORT = 65535;
const PROBE_TIMEOUT = 500;

// Binds the server and returns the port it's listening on. The port is known
// only once it's bound, so nothing can announce a port this process doesn't
// hold. When several processes start at the same time and go for the same
// port, the OS lets exactly one of them bind it and the rest move on.
export async function listenOnAvailablePort(
  server: net.Server,
  { port, portRetries, host }: Args
): Promise<number> {
  if (port === 0) {
    await listen(server, port, host);
    return getBoundPort(server);
  }

  if (isUnsafePort(port)) {
    console.log(
      `[Cosmos] Warning: Browsers block port ${port}, choose another one if the Cosmos UI doesn't load`
    );
  }

  const lastPort = Math.min(port + portRetries, MAX_PORT);
  for (let nextPort = port; nextPort <= lastPort; nextPort++) {
    // The requested port is respected, but there's no point in moving to a
    // port that browsers can't open
    if (nextPort !== port && isUnsafePort(nextPort)) continue;

    if (
      !(await isPortInUse(nextPort, host)) &&
      (await tryListen(server, nextPort, host))
    ) {
      return getBoundPort(server);
    }

    if (nextPort < lastPort) {
      console.log(`[Cosmos] Port ${nextPort} already in use, trying next...`);
    }
  }

  throw new Error(
    lastPort === port
      ? `Port ${port} is already in use`
      : `No available port found between ${port} and ${lastPort}`
  );
}

async function tryListen(
  server: net.Server,
  port: number,
  host: null | string
) {
  try {
    await listen(server, port, host);
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') return false;
    throw err;
  }
}

function listen(server: net.Server, port: number, host: null | string) {
  return new Promise<void>((resolve, reject) => {
    function onListening() {
      server.off('error', onError);
      resolve();
    }
    function onError(err: Error) {
      server.off('listening', onListening);
      reject(err);
    }
    server.once('listening', onListening);
    server.once('error', onError);

    if (host === null) server.listen(port);
    else server.listen(port, host);
  });
}

function getBoundPort(server: net.Server) {
  return (server.address() as net.AddressInfo).port;
}

// Binding a port only fails when another server holds the same address. On
// some systems (eg. macOS) a server listening on all addresses and another
// one listening on localhost can both bind the same port, and then it's
// unclear which of them a browser reaches. So before binding a port we also
// check that nothing answers on it at the addresses our clients would use.
async function isPortInUse(port: number, host: null | string) {
  const hosts = host === null || isWildcardHost(host) ? loopbackHosts : [host];
  const results = await Promise.all(hosts.map(h => canConnect(port, h)));
  return results.includes(true);
}

const loopbackHosts = ['127.0.0.1', '::1'];

const wildcardHosts = new Set([
  '0.0.0.0',
  '::',
  '0000:0000:0000:0000:0000:0000:0000:0000',
]);

function isWildcardHost(host: string) {
  return wildcardHosts.has(host);
}

function canConnect(port: number, host: string) {
  return new Promise<boolean>(resolve => {
    const socket = net.connect({ port, host });

    function done(connected: boolean) {
      socket.destroy();
      resolve(connected);
    }

    socket.once('connect', () => done(true));
    // Most of the time this is a refused connection, but any other failure
    // (like an unavailable address family) also means nobody is answering
    socket.once('error', () => done(false));
    socket.setTimeout(PROBE_TIMEOUT, () => done(false));
  });
}

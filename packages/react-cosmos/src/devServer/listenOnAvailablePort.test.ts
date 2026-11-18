import http from 'node:http';
import net from 'node:net';
import { mockConsole } from '../testHelpers/mockConsole.js';
import { createTestPortFinder } from '../testHelpers/testPorts.js';
import { listenOnAvailablePort } from './listenOnAvailablePort.js';
import { isUnsafePort } from './unsafePorts.js';

const findTestPort = createTestPortFinder(20000);

const servers: net.Server[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map(closeServer));
});

function createServer() {
  const server = http.createServer();
  servers.push(server);
  return server;
}

function closeServer(server: net.Server) {
  return new Promise<void>(resolve => {
    if (server.listening) server.close(() => resolve());
    else resolve();
  });
}

// Take a port the way another process would
async function occupyPort(port: number, host?: string) {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  return (server.address() as net.AddressInfo).port;
}

// Take a port that has free ports after it
async function occupyTestPort(host?: string) {
  return occupyPort(await findTestPort(), host);
}

function boundPort(server: net.Server) {
  return (server.address() as net.AddressInfo).port;
}

it('listens on the requested port', async () => {
  const port = await findTestPort();
  const server = createServer();

  const args = { port, portRetries: 10, host: null };
  expect(await listenOnAvailablePort(server, args)).toBe(port);
  expect(boundPort(server)).toBe(port);
});

it('moves to another port when the requested one is taken', async () => {
  const port = await occupyTestPort();
  const server = createServer();

  await mockConsole(async ({ expectLog }) => {
    expectLog(`[Cosmos] Port ${port} already in use, trying next...`);

    const args = { port, portRetries: 10, host: null };
    const newPort = await listenOnAvailablePort(server, args);
    expect(newPort).toBeGreaterThan(port);
    expect(newPort).toBeLessThanOrEqual(port + 10);
    expect(boundPort(server)).toBe(newPort);
  });
});

// A server that only listens on localhost doesn't always prevent another one
// from binding the same port on all addresses (eg. on macOS)
it.each(['127.0.0.1', '::1'])(
  'moves to another port when the requested one is taken on %s',
  async localhost => {
    let port: number;
    try {
      port = await occupyTestPort(localhost);
    } catch {
      // No IPv6 on this machine
      return;
    }
    const server = createServer();

    await mockConsole(async ({ expectLog }) => {
      expectLog(`[Cosmos] Port ${port} already in use, trying next...`);

      const args = { port, portRetries: 10, host: null };
      expect(await listenOnAvailablePort(server, args)).toBeGreaterThan(port);
    });
  }
);

it('moves to another port when the host port is taken on all addresses', async () => {
  const port = await occupyTestPort('0.0.0.0');
  const server = createServer();

  await mockConsole(async ({ expectLog }) => {
    expectLog(`[Cosmos] Port ${port} already in use, trying next...`);

    const args = { port, portRetries: 10, host: '127.0.0.1' };
    expect(await listenOnAvailablePort(server, args)).toBeGreaterThan(port);
  });
});

it('gives each server its own port when they start at the same time', async () => {
  const port = await findTestPort();
  const args = { port, portRetries: 10, host: null };

  await mockConsole(async ({ expectLog }) => {
    expectLog(`[Cosmos] Port ${port} already in use, trying next...`);

    const ports = await Promise.all([
      listenOnAvailablePort(createServer(), args),
      listenOnAvailablePort(createServer(), args),
      listenOnAvailablePort(createServer(), args),
    ]);
    expect(new Set(ports).size).toBe(3);
    expect(ports).toContain(port);
  });
});

it('fails when the requested port is taken and retries are off', async () => {
  const port = await occupyTestPort();
  const server = createServer();

  const args = { port, portRetries: 0, host: null };
  await expect(listenOnAvailablePort(server, args)).rejects.toThrow(
    `Port ${port} is already in use`
  );
  expect(server.listening).toBe(false);
});

it('fails when no port is available within the retry limit', async () => {
  const port = await occupyTestPort();
  const nextPort = port + 1;
  try {
    await occupyPort(nextPort);
  } catch {
    // Already taken, which serves this test just as well
  }
  const server = createServer();

  await mockConsole(async ({ expectLog }) => {
    expectLog(`[Cosmos] Port ${port} already in use, trying next...`);

    const args = { port, portRetries: 1, host: null };
    await expect(listenOnAvailablePort(server, args)).rejects.toThrow(
      `No available port found between ${port} and ${nextPort}`
    );
  });
});

it('skips ports blocked by browsers', async () => {
  // 5060 and 5061 are blocked
  const port = 5059;
  try {
    await occupyPort(port);
  } catch {
    // Already taken, which serves this test just as well
  }
  const server = createServer();

  await mockConsole(async ({ expectLog }) => {
    expectLog(`[Cosmos] Port ${port} already in use, trying next...`);

    const args = { port, portRetries: 10, host: null };
    const newPort = await listenOnAvailablePort(server, args);
    expect(newPort).toBeGreaterThanOrEqual(5062);
    expect(isUnsafePort(newPort)).toBe(false);
  });
});

it('warns about a requested port blocked by browsers', async () => {
  const port = 10080;
  const server = createServer();

  await mockConsole(async ({ expectLog }) => {
    expectLog(
      `[Cosmos] Warning: Browsers block port ${port}, choose another one if the Cosmos UI doesn't load`
    );

    const args = { port, portRetries: 10, host: null };
    await listenOnAvailablePort(server, args);
  });
});

it('lets the OS pick a port when the requested port is 0', async () => {
  const server = createServer();

  const args = { port: 0, portRetries: 0, host: null };
  const port = await listenOnAvailablePort(server, args);
  expect(port).toBeGreaterThan(0);
  expect(boundPort(server)).toBe(port);
});

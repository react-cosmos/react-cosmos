import net from 'node:net';

// Room for a test to try the ports that follow the one it gets
const PORTS_PER_TEST = 20;

// Tests that take a port and expect the next ones to be free can't start from
// a port assigned by the OS, because the ports that follow it are the ones
// the OS assigns to other tests running at the same time. Such tests get their
// ports from a range of their own instead, which has to be below the ports the
// OS assigns (49152+ on macOS, 32768+ on Linux) and different in each test
// file.
export function createTestPortFinder(firstPort: number) {
  let nextPort = firstPort;

  return async function findTestPort(): Promise<number> {
    const port = nextPort;
    nextPort += PORTS_PER_TEST;
    return (await isPortFree(port)) ? port : findTestPort();
  };
}

function isPortFree(port: number) {
  return new Promise<boolean>(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(port, () => server.close(() => resolve(true)));
  });
}

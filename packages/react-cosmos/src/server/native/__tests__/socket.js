/**
 * @flow
 * @jest-environment node
 */

import { startServer } from '../start';
import io from 'socket.io-client';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 10002,
    hostname: null,
    publicUrl: '/'
  })
}));

let stopServer;

beforeEach(async () => {
  jest.clearAllMocks();
  stopServer = await startServer();
});

afterEach(async () => {
  await stopServer();
});

it('broadcasts events to between clients', async () => {
  const socket1 = io('http://localhost:10002');
  const socket2 = io('http://localhost:10002');

  await untilConnected(socket1);
  await untilConnected(socket2);

  await new Promise(resolve => {
    socket2.on('cosmos-cmd', msg => {
      resolve();
      expect(msg).toEqual({ type: 'MY_CMD' });
    });
    socket1.emit('cosmos-cmd', { type: 'MY_CMD' });
  });
});

function untilConnected(socket) {
  return new Promise(resolve => {
    socket.on('connect', resolve);
  });
}

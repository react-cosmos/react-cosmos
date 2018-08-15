/**
 * @flow
 * @jest-environment node
 */

import { createServer } from 'http';
import request from 'request-promise-native';
import express from 'express';
import promisify from 'util.promisify';
import { startServer } from '../../start';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    port: 9003,
    hostname: '127.0.0.1',
    httpProxy: {
      context: '/api',
      target: 'http://127.0.0.1:4444'
    },
    watchDirs: ['.'],
    globalImports: [],
    // Deprecated options needed for backwards compatibility
    componentPaths: []
  })
}));

let stopServer;
let stopProxyServer;

// Server tests share a single beforeAll case to minimize webpack compilation
beforeAll(async () => {
  jest.clearAllMocks();
  stopServer = await startServer();
  stopProxyServer = await startProxyServer();
});

afterAll(async () => {
  await stopServer();
  await stopProxyServer();
});

it('creates http proxy', async () => {
  const res = await request({
    uri: 'http://127.0.0.1:9003/api/test'
  });
  expect(res).toBe('Hello World');
});

async function startProxyServer() {
  const app = express();
  app.get('/api/test', (req: express$Request, res: express$Response) => {
    res.send('Hello World');
  });

  const server = createServer(app);
  const listen = promisify(server.listen.bind(server));
  await listen(4444, '127.0.0.1');

  return async () => {
    await promisify(server.close.bind(server))();
  };
}

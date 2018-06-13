/**
 * @flow
 * @jest-environment node
 */

import EventSource from 'eventsource';
import { startServer } from '../../start';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    port: 9002,
    hostname: '127.0.0.1',
    hot: true,
    watchDirs: ['.'],
    globalImports: [],
    // Deprecated options needed for backwards compatibility
    componentPaths: []
  })
}));

let stopServer;

// Server tests share a single beforeAll case to minimize webpack compilation
beforeAll(async () => {
  jest.clearAllMocks();
  stopServer = await startServer();
});

afterAll(async () => {
  await stopServer();
});

it('activates webpack hmr', async () => {
  const es = new EventSource('http://127.0.0.1:9002/__webpack_hmr');

  await new Promise((resolve, reject) => {
    es.addEventListener('open', resolve);
    es.addEventListener('error', reject);
  });

  es.close();
});

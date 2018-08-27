/**
 * @flow
 * @jest-environment node
 */

import request from 'request-promise-native';
import { startServer } from '../../start';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9007,
    hostname: '127.0.0.1',
    publicUrl: '/static/',
    webpackConfigPath: require.resolve(
      './__fsmocks__/webpack.config-contentbase'
    ),
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

it('serves static assets from webpack.devServer.contentBase', async () => {
  const res = await request('http://127.0.0.1:9007/static/robots.txt');
  expect(res.replace(/\s+$/, '')).toEqual(`we are the people`);
});

/**
 * @flow
 * @jest-environment node
 */

import { join } from 'path';
import request from 'request-promise-native';
import { startServer } from '../../start';

const mockRootPath = __dirname;
const mockPublicPath = join(__dirname, '__fsmocks__/static');

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9008,
    hostname: '127.0.0.1',
    publicPath: mockPublicPath,
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

// Note: This test is ment to show that a custom publicPath overrides
// webpack.devServer.contentBase
it('serves static assets from Cosmos publicPath', async () => {
  const res = await request('http://127.0.0.1:9008/static/robots.txt');
  expect(res.replace(/\s+$/, '')).toEqual(`we are the robots`);
});

/**
 * @flow
 * @jest-environment node
 */

import { readFileSync } from 'fs';
import request from 'request-promise-native';
import { replaceKeys } from 'react-cosmos-shared2/util';
import { startServer } from '../../start';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    port: 9005,
    hostname: '127.0.0.1',
    webpackConfigPath: require.resolve('./__fsmocks__/webpack.config'),
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

it('serves index.html on / route with template vars replaced', async () => {
  const res = await request('http://127.0.0.1:9005/');
  const source = readFileSync(
    require.resolve('../../../shared/static/index.html'),
    'utf8'
  );

  expect(res).toEqual(
    replaceKeys(source, {
      __PLAYGROUND_OPTS__: JSON.stringify({
        platform: 'web',
        projectKey: mockRootPath,
        loaderUri: '/_loader.html',
        webpackConfigType: 'custom', // <<< This is relevant in this test
        deps: {
          'html-webpack-plugin': true
        }
      })
    })
  );
});

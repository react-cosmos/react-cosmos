/**
 * @flow
 * @jest-environment node
 */

import { readFileSync } from 'fs';
import request from 'request-promise-native';
import { argv } from 'yargs';
import { replaceKeys } from '../../../shared/template';
import { startServer } from '../../start';
import webpackConfig from './__fsmocks__/webpack.config-fn';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    port: 9006,
    hostname: '127.0.0.1',
    webpackConfigPath: require.resolve('./__fsmocks__/webpack.config-fn'),
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

it('calls webpack config function with env', () => {
  expect(webpackConfig.mock.calls[0][0]).toBe(process.env.NODE_ENV);
});

it('calls webpack config function with argv', () => {
  expect(webpackConfig.mock.calls[0][1]).toEqual(argv);
});

it('serves index.html on / route with template vars replaced', async () => {
  const res = await request('http://127.0.0.1:9006/');
  const source = readFileSync(
    require.resolve('../../../shared/static/index.html'),
    'utf8'
  );

  expect(res).toEqual(
    replaceKeys(source, {
      __SCRIPT_SRC__: '_playground.js',
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

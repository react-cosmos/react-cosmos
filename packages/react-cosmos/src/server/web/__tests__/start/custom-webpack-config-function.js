/**
 * @flow
 * @jest-environment node
 */

import fs from 'fs';
import request from 'request-promise-native';
import { argv } from 'yargs';
import promisify from 'util.promisify';
import { startServer } from '../../start';
import webpackConfig from './__fsmocks__/webpack.config-fn';

const readFileAsync = promisify(fs.readFile);
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

it('serves index.html on / route with playgrounds opts included', async () => {
  const res = await request('http://127.0.0.1:9006/');
  const source = await readFileAsync(
    require.resolve('../../../shared/static/index.html'),
    'utf8'
  );

  expect(res).toEqual(
    source.replace(
      '__PLAYGROUND_OPTS__',
      JSON.stringify({
        projectKey: mockRootPath,
        loaderTransport: 'postMessage',
        loaderUri: '/_loader.html',
        webpackConfigType: 'custom', // <<< This is relevant in this test
        deps: {
          'html-webpack-plugin': true
        }
      })
    )
  );
});

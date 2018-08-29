/**
 * @flow
 * @jest-environment node
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import request from 'request-promise-native';
import { replaceKeys } from '../../../shared/template';
import { startServer } from '../../start';

const mockRootPath = __dirname;
const mockPublicPath = join(__dirname, '__fsmocks__/static');

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9004,
    hostname: '127.0.0.1',
    publicPath: mockPublicPath,
    publicUrl: '/static/',
    globalImports: [],
    watchDirs: ['.'],
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

// Ensure that the static server doesn't override the / path
it('serves index.html on / route with template vars replaced', async () => {
  const res = await request('http://127.0.0.1:9004/');
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
        loaderUri: '/static/_loader.html',
        webpackConfigType: 'default',
        deps: {
          'html-webpack-plugin': true
        }
      })
    })
  );
});

it('serves static asset', async () => {
  const res = await request('http://127.0.0.1:9004/static/robots.txt');
  expect(res.replace(/\s+$/, '')).toEqual(`we are the robots`);
});

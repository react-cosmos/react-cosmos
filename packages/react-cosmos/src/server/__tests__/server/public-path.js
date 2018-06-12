/**
 * @jest-environment node
 */

import { readFile } from 'fs';
import { join } from 'path';
import request from 'request-promise-native';
import promisify from 'util.promisify';
import startServer from '../../server-web';

const readFileAsync = promisify(readFile);

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
it('serves index.html on / route with playgrounds opts included', async () => {
  const res = await request('http://127.0.0.1:9004/');
  const source = await readFileAsync(
    require.resolve('../../static/index.html'),
    'utf8'
  );

  expect(res).toEqual(
    source.replace(
      '__PLAYGROUND_OPTS__',
      JSON.stringify({
        loaderUri: '/static/_loader.html',
        projectKey: mockRootPath,
        webpackConfigType: 'default',
        deps: {
          'html-webpack-plugin': true
        }
      })
    )
  );
});

it('serves static asset', async () => {
  const res = await request('http://127.0.0.1:9004/static/robots.txt');
  expect(res).toEqual(`we are the robots\n`);
});

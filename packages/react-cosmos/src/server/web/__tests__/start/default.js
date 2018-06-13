/**
 * @flow
 * @jest-environment node
 */

import fs from 'fs';
import EventSource from 'eventsource';
import request from 'request-promise-native';
import promisify from 'util.promisify';
import { startServer } from '../../start';
import { generateCosmosConfig } from 'react-cosmos-config';

const readFileAsync = promisify(fs.readFile);
const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  generateCosmosConfig: jest.fn(),
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    port: 9001,
    hostname: '127.0.0.1',
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

it('serves webpack bundle', async () => {
  const res = await request({
    uri: 'http://127.0.0.1:9001/main.js',
    resolveWithFullResponse: true
  });

  expect(res.statusCode).toBe(200);
});

it('serves index.html on / route with playgrounds opts included', async () => {
  const res = await request('http://127.0.0.1:9001/');
  const source = await readFileAsync(
    require.resolve('../../../shared/static/index.html'),
    'utf8'
  );

  expect(res).toEqual(
    source.replace(
      '__PLAYGROUND_OPTS__',
      JSON.stringify({
        platform: 'web',
        projectKey: mockRootPath,
        loaderUri: '/_loader.html',
        webpackConfigType: 'default',
        deps: {
          'html-webpack-plugin': true
        }
      })
    )
  );
});

it('serves playground js on /_playground.js route', async () => {
  const res = await request('http://127.0.0.1:9001/_playground.js');
  const source = await readFileAsync(
    require.resolve('react-cosmos-playground'),
    'utf8'
  );

  expect(res).toEqual(source);
});

it('serves favicon.ico on /_cosmos.ico route', async () => {
  const res = await request('http://127.0.0.1:9001/_cosmos.ico');
  const source = await readFileAsync(
    require.resolve('../../../shared/static/favicon.ico'),
    'utf8'
  );

  expect(res).toEqual(source);
});

it('does not activate webpack hmr', async () => {
  const es = new EventSource('http://127.0.0.1:9001/__webpack_hmr');

  await new Promise((resolve, reject) => {
    es.addEventListener('open', reject);
    es.addEventListener('error', resolve);
  });

  es.close();
});

it('does not call config generation function', () => {
  expect(generateCosmosConfig).not.toHaveBeenCalled();
});

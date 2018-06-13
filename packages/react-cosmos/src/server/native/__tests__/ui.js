/**
 * @flow
 * @jest-environment node
 */

import { readFile } from 'fs';
import request from 'request-promise-native';
import promisify from 'util.promisify';
import { startServer } from '../start';

const readFileAsync = promisify(readFile);
const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 10001,
    hostname: null,
    publicUrl: '/'
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

it('serves index.html on / route with playgrounds opts included', async () => {
  const res = await request('http://127.0.0.1:10001/');
  const source = await readFileAsync(
    require.resolve('../../shared/static/index.html'),
    'utf8'
  );

  const playgroundOpts = {
    projectKey: mockRootPath,
    loaderTransport: 'websockets'
  };
  expect(res).toEqual(
    source.replace('__PLAYGROUND_OPTS__', JSON.stringify(playgroundOpts))
  );
});

it('serves playground js on /_playground.js route', async () => {
  const res = await request('http://127.0.0.1:10001/_playground.js');
  const source = await readFileAsync(
    require.resolve('react-cosmos-playground'),
    'utf8'
  );

  expect(res).toEqual(source);
});

it('serves favicon.ico on /_cosmos.ico route', async () => {
  const res = await request('http://127.0.0.1:10001/_cosmos.ico');
  const source = await readFileAsync(
    require.resolve('../../shared/static/favicon.ico'),
    'utf8'
  );

  expect(res).toEqual(source);
});

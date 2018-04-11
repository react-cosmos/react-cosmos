import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import promisify from 'util.promisify';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import startServer from '../../server';
import extendWebpackConfig from '../../extend-webpack-config';
import { generateCosmosConfig } from 'react-cosmos-config';

const readFileAsync = promisify(fs.readFile);
const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  generateCosmosConfig: jest.fn(),
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9999,
    hostname: '127.0.0.1',
    globalImports: [],
    componentPaths: []
  })
}));

const getCbs = {};
const mockGet = jest.fn((path, cb) => {
  getCbs[path] = cb;
});
const mockUse = jest.fn();
const mockListen = jest.fn();

jest.mock('express', () => {
  const mockExpress = jest.fn(() => ({
    get: mockGet,
    use: mockUse,
    listen: mockListen
  }));
  mockExpress.static = jest.fn();
  return mockExpress;
});

jest.mock('webpack', () => jest.fn(() => 'MOCK_WEBPACK_COMPILER'));

jest.mock('webpack-dev-middleware', () => jest.fn(() => 'MOCK_DEV_MIDDLEWARE'));
jest.mock('webpack-hot-middleware', () => jest.fn(() => 'MOCK_HOT_MIDDLEWARE'));

jest.mock('../../default-webpack-config', () =>
  jest.fn(() => 'MOCK_DEFAULT_WEBPACK_CONFIG')
);

jest.mock('../../extend-webpack-config', () =>
  jest.fn(() => 'MOCK_WEBPACK_CONFIG')
);

beforeEach(() => {
  jest.clearAllMocks();
  startServer();
});

it('calls extendWebpackConfig using webpack', () => {
  expect(extendWebpackConfig.mock.calls[0][0].webpack).toBe(webpack);
});

it('extends webpack config from default config', () => {
  expect(extendWebpackConfig.mock.calls[0][0].userWebpackConfig).toBe(
    'MOCK_DEFAULT_WEBPACK_CONFIG'
  );
});

it('compiles webpack using extended config', () => {
  expect(webpack).toHaveBeenCalledWith('MOCK_WEBPACK_CONFIG');
});

it('creates express server', () => {
  expect(express).toHaveBeenCalled();
});

it('sends webpack compiler to dev middleware', () => {
  expect(webpackDevMiddleware.mock.calls[0][0]).toBe('MOCK_WEBPACK_COMPILER');
});

it('sends publicPath to dev middleware', () => {
  expect(webpackDevMiddleware.mock.calls[0][1].publicPath).toBe('/loader/');
});

it('adds loader dev middleware to express server', () => {
  expect(mockUse).toHaveBeenCalledWith('MOCK_DEV_MIDDLEWARE');
});

it('serves index.html on / route with playgrounds opts included', async () => {
  const send = jest.fn();
  getCbs['/']({}, { send });

  const htmlContents = await readFileAsync(
    require.resolve('../../static/index.html'),
    'utf8'
  );

  expect(send).toHaveBeenCalledWith(
    htmlContents.replace(
      '__PLAYGROUND_OPTS__',
      JSON.stringify({
        loaderUri: './loader/index.html',
        projectKey: mockRootPath,
        webpackConfigType: 'default',
        deps: {
          'html-webpack-plugin': true
        }
      })
    )
  );
});

it('serve favicon.ico on /favicon.ico route', () => {
  const sendFile = jest.fn();
  getCbs['/favicon.ico']({}, { sendFile });

  expect(sendFile).toHaveBeenCalledWith(
    require.resolve('../../static/favicon.ico')
  );
});

it('does not use hot middleware', () => {
  expect(webpackHotMiddleware).not.toHaveBeenCalled();
});

it('does not create static server', () => {
  expect(express.static).not.toHaveBeenCalled();
});

it('starts express server with hostname & port', () => {
  const [port, hostname] = mockListen.mock.calls[0];
  expect(port).toBe(9999);
  expect(hostname).toBe('127.0.0.1');
});

it('does not call config generation function', () => {
  expect(generateCosmosConfig).not.toHaveBeenCalled();
});

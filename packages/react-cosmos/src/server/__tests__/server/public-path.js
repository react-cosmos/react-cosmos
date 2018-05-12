import express from 'express';
import startServer from '../../server';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9999,
    hostname: '127.0.0.1',
    publicPath: 'server/public',
    publicUrl: '/static/',
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
  mockExpress.static = jest.fn(() => 'MOCK_EXPRESS_STATIC');
  return mockExpress;
});

const mockWebpackCompiler = () => {};
mockWebpackCompiler.plugin = () => {};

jest.mock('webpack', () => jest.fn(() => mockWebpackCompiler));

jest.mock('webpack-dev-middleware', () => jest.fn(() => 'MOCK_DEV_MIDDLEWARE'));
jest.mock('webpack-hot-middleware', () => jest.fn(() => 'MOCK_HOT_MIDDLEWARE'));

jest.mock('../../extend-webpack-config', () =>
  jest.fn(() => 'MOCK_WEBPACK_CONFIG')
);

beforeEach(() => {
  jest.clearAllMocks();
  startServer();
});

it('creates static server with public path', () => {
  expect(express.static).toHaveBeenCalledWith('server/public', {
    index: false
  });
});

it('sends public url to express server', () => {
  expect(mockUse.mock.calls[1][0]).toBe('/static/');
});

it('sends public url to express server', () => {
  expect(mockUse.mock.calls[1][1]).toBe('MOCK_EXPRESS_STATIC');
});

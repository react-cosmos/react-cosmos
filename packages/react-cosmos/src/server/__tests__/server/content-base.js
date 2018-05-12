import express from 'express';
import startServer from '../../server';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9999,
    hostname: '127.0.0.1',
    publicUrl: '/static/',
    webpackConfigPath: require.resolve('./__fsmocks__/webpack.config'),
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

jest.mock('./__fsmocks__/webpack.config', () => ({
  devServer: {
    contentBase: 'user/server/public'
  }
}));

jest.mock('../../extend-webpack-config', () =>
  jest.fn(() => 'MOCK_WEBPACK_CONFIG')
);

beforeEach(() => {
  jest.clearAllMocks();
  startServer();
});

it('creates static server with webpack.devServer.contentBase', () => {
  expect(express.static).toHaveBeenCalledWith('user/server/public', {
    index: false
  });
});

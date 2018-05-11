import path from 'path';
import webpack from 'webpack';
import startServer from '../../server';
import extendWebpackConfig from '../../extend-webpack-config';

const mockRootPath = __dirname;
const mockWebpackConfigPath = path.join(
  mockRootPath,
  './__fsmocks__/missing.webpack.config'
);

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/loader/',
    port: 9999,
    hostname: '127.0.0.1',
    webpackConfigPath: mockWebpackConfigPath,
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

const mockWebpackCompiler = () => {};
mockWebpackCompiler.plugin = () => {};

jest.mock('webpack', () => jest.fn(() => mockWebpackCompiler));

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

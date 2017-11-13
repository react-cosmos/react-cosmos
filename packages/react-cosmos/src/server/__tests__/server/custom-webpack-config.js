import fs from 'fs';
import webpack from 'webpack';
import promisify from 'util.promisify';
import startServer from '../../server';
import extendWebpackConfig from '../../extend-webpack-config';

const readFileAsync = promisify(fs.readFile);
const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 9999,
    hostname: '127.0.0.1',
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
  mockExpress.static = jest.fn();
  return mockExpress;
});

jest.mock('webpack', () => jest.fn(() => 'MOCK_WEBPACK_COMPILER'));

jest.mock('webpack-dev-middleware', () => jest.fn(() => 'MOCK_DEV_MIDDLEWARE'));
jest.mock('webpack-hot-middleware', () => jest.fn(() => 'MOCK_HOT_MIDDLEWARE'));

jest.mock('./__fsmocks__/webpack.config', () => 'MOCK_CUSTOM_WEBPACK_CONFIG');

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

it('extends webpack config from user config', () => {
  expect(extendWebpackConfig.mock.calls[0][0].userWebpackConfig).toBe(
    'MOCK_CUSTOM_WEBPACK_CONFIG'
  );
});

it('compiles webpack using extended config', () => {
  expect(webpack).toHaveBeenCalledWith('MOCK_WEBPACK_CONFIG');
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
        webpackConfigType: 'custom'
      })
    )
  );
});

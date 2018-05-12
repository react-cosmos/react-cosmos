import extendWebpackConfig from '../../extend-webpack-config';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: ['./global.css'],
    publicUrl: '/static/',
    hot: true
  })
}));

const DefinePlugin = jest.fn();
const NoEmitOnErrorsPlugin = jest.fn();
const HotModuleReplacementPlugin = jest.fn();
const webpack = {
  DefinePlugin,
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin
};

const getConfig = () =>
  extendWebpackConfig({
    webpack,
    userWebpackConfig: {}
  });

beforeEach(() => {
  jest.clearAllMocks();
});

it('adds resolved global imports to entries', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.entry).toContain('./global.css');
});

it('adds loader entry last', () => {
  const webpackConfig = getConfig();
  const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
  expect(cosmosEntry).toBe(require.resolve('../../../client/loader-entry'));
});

it('adds hot middleware client to entries', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.entry).toContain(
    `${require.resolve(
      'webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('adds HotModuleReplacementPlugin', () => {
  const hmrPlugin = {};
  webpack.HotModuleReplacementPlugin.mockImplementation(() => hmrPlugin);
  const webpackConfig = getConfig();
  expect(webpackConfig.plugins).toContain(hmrPlugin);
});

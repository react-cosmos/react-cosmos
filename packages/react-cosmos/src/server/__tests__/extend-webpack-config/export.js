import extendWebpackConfig from '../../extend-webpack-config';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: ['./global.css'],
    publicUrl: '/loader/',
    hot: true,
    outputPath: '__mock__outputPath',
    containerQuerySelector: '__mock__containerQuerySelector'
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
    userWebpackConfig: {},
    shouldExport: true
  });

beforeEach(() => {
  jest.clearAllMocks();
});

it('creates proper output', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.output).toMatchObject({
    path: '__mock__outputPath/loader/',
    filename: '[name].js',
    publicPath: '/loader/'
  });
});

it('does not add hot middleware client to entries', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.entry).not.toContain(
    `${require.resolve('webpack-hot-middleware/client')}?reload=true`
  );
});

it('adds DefinePlugin with NODE_ENV set to production', () => {
  const plugin = {};
  webpack.DefinePlugin.mockImplementation(contents => {
    try {
      expect(contents).toEqual({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      });
      return plugin;
    } catch (err) {
      return {};
    }
  });

  const webpackConfig = getConfig();
  expect(webpackConfig.plugins).toContain(plugin);
});

it('adds DefinePlugin plugin with user config path', () => {
  const plugin = {};
  webpack.DefinePlugin.mockImplementation(contents => {
    try {
      expect(contents).toEqual({
        COSMOS_CONFIG: JSON.stringify({
          containerQuerySelector: '__mock__containerQuerySelector'
        })
      });
      return plugin;
    } catch (err) {
      return {};
    }
  });

  const webpackConfig = getConfig();
  expect(webpackConfig.plugins).toContain(plugin);
});

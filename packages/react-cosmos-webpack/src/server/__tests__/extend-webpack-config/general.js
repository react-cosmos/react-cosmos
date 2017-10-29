import extendWebpackConfig from '../../extend-webpack-config';

jest.mock('react-cosmos-config', () => () => ({
  componentPaths: ['src/components'],
  fixturePaths: ['test/fixtures'],
  ignore: [],
  globalImports: ['./global.css'],
  containerQuerySelector: '__mock__containerQuerySelector'
}));

const DefinePlugin = jest.fn();
const NoEmitOnErrorsPlugin = jest.fn();
const webpack = {
  DefinePlugin,
  NoEmitOnErrorsPlugin
};

const plugins = [{}, {}];
const getConfig = () =>
  extendWebpackConfig({
    webpack,
    userWebpackConfig: { plugins }
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

it('keeps user plugins', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.plugins).toContain(plugins[0]);
  expect(webpackConfig.plugins).toContain(plugins[1]);
});

it('adds DefinePlugin with NODE_ENV set to development', () => {
  const plugin = {};
  webpack.DefinePlugin.mockImplementation(contents => {
    try {
      expect(contents).toEqual({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
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

it('creates proper output', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.output).toEqual({
    path: '/loader/',
    filename: '[name].js',
    publicPath: '/loader/'
  });
});

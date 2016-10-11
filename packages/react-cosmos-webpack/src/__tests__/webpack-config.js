jest.mock('webpack');

// Webpack is a peer dependency and does't need to exist locally. We're mocking
// it here so we'll never really attempt to import it.
// eslint-disable-next-line import/no-unresolved
const webpack = require('webpack');

const DefinePluginMock = {};
const DefinePlugin = jest.fn(() => DefinePluginMock);
webpack.__setPluginMock('DefinePlugin', DefinePlugin);

const cosmosConfigPath = require.resolve('./dummy.config');
const userCosmosConfig = {
  componentPaths: ['src/components'],
  ignore: [],
  globalImports: ['./global.css'],
};
jest.mock('./dummy.config', () => userCosmosConfig);

const mockBuildPaths = jest.fn(() => ({
  components: '__MOCK_COMPONENTS__',
  fixtures: '__MOCK_FIXTURES__',
}));
jest.mock('../build-module-paths', () => mockBuildPaths);

const getWebpackConfig = require('../webpack-config').default;

const userWebpackConfig = {
  loaders: [],
  plugins: [
    // fake plugins, something to compare identity with
    {}, {},
  ],
};
const webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);

test('keeps user loaders', () => {
  expect(webpackConfig.loaders).toBe(userWebpackConfig.loaders);
});

test('builds module paths using user config', () => {
  const { calls } = mockBuildPaths.mock;
  expect(calls[0][0]).toBe(userCosmosConfig.componentPaths);
  expect(calls[0][1]).toBe(userCosmosConfig.ignore);
});

test('adds global imports to entries', () => {
  userCosmosConfig.globalImports.forEach((globalImport) => {
    expect(webpackConfig.entry).toContain(globalImport);
  });
});

test('adds hot middleware client to entries', () => {
  expect(webpackConfig.entry).toContain(require.resolve('webpack-hot-middleware/client'));
});

test('adds cosmos entry with cosmos loader and module paths in loader query', () => {
  const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
  const loaderPath = require.resolve('../entry-loader');
  const entryPath = require.resolve('../entry');
  const stringifiedModules = '{"components":"__MOCK_COMPONENTS__","fixtures":"__MOCK_FIXTURES__"}';
  const entryMatcher = new RegExp(`^${loaderPath}\\?${stringifiedModules}!${entryPath}$`);
  expect(cosmosEntry).toMatch(entryMatcher);
});

test('creates proper output', () => {
  expect(webpackConfig.output).toEqual({
    path: '/',
    filename: 'bundle.js',
    publicPath: '/',
  });
});

test('keeps user plugins', () => {
  userWebpackConfig.plugins.forEach((plugin) => {
    expect(webpackConfig.plugins).toContain(plugin);
  });
});

test('calls define plugin with user config path', () => {
  expect(DefinePlugin.mock.calls[0][0]).toEqual({
    COSMOS_CONFIG_PATH: JSON.stringify(cosmosConfigPath),
  });
});

test('adds DefinePlugin', () => {
  expect(webpackConfig.plugins).toContain(DefinePluginMock);
});

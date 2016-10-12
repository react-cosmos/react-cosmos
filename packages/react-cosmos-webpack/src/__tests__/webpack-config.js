jest.mock('webpack');

let DefinePluginMock;
let DefinePlugin;

let mockBuildPaths;
let getWebpackConfig;

const cosmosConfigPath = require.resolve('./dummy-config/cosmos.config');

// So far we use the same user webpack mock between all tests
const userWebpackConfig = {
  loaders: [],
  plugins: [
    // fake plugins, something to compare identity with
    {}, {},
  ],
};

// This changes between test cases
let cosmosConfig;
// This is the output that we test
let webpackConfig;

beforeEach(() => {
  // We want to change configs between test cases
  jest.resetModules();

  // Mock user config
  jest.mock('./dummy-config/cosmos.config', () => cosmosConfig);

  // Mock already tested lib
  mockBuildPaths = jest.fn(() => ({
    components: '__MOCK_COMPONENTS__',
    fixtures: '__MOCK_FIXTURES__',
  }));
  jest.mock('../build-module-paths', () => mockBuildPaths);

  // Mock webpack plugin
  DefinePluginMock = {};
  DefinePlugin = jest.fn(() => DefinePluginMock);
  require('webpack').__setPluginMock('DefinePlugin', DefinePlugin);

  getWebpackConfig = require('../webpack-config').default;
});

describe('without hmr', () => {
  beforeEach(() => {
    cosmosConfig = {
      componentPaths: ['src/components'],
      ignore: [],
      globalImports: ['./global.css'],
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('keeps user loaders', () => {
    expect(webpackConfig.loaders).toBe(userWebpackConfig.loaders);
  });

  test('builds module paths using user config', () => {
    const { calls } = mockBuildPaths.mock;
    expect(calls[0][0]).toBe(cosmosConfig.componentPaths);
    expect(calls[0][1]).toBe(cosmosConfig.ignore);
  });

  test('adds global imports to entries', () => {
    cosmosConfig.globalImports.forEach((globalImport) => {
      expect(webpackConfig.entry).toContain(globalImport);
    });
  });

  test('adds cosmos entry with cosmos loader and module paths in loader query', () => {
    const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
    const loaderPath = require.resolve('../entry-loader');
    const entryPath = require.resolve('../entry');
    const stringifiedModules =
      '{"components":"__MOCK_COMPONENTS__","fixtures":"__MOCK_FIXTURES__"}';
    const entryMatcher = new RegExp(`^${loaderPath}\\?${stringifiedModules}!${entryPath}$`);
    expect(cosmosEntry).toMatch(entryMatcher);
  });

  test('does not add hot middleware client to entries', () => {
    expect(webpackConfig.entry).not.toContain(require.resolve('webpack-hot-middleware/client'));
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
});

// Hmr setting affects entries, so only entry-related are duplicated here
describe('with hmr', () => {
  beforeEach(() => {
    cosmosConfig = {
      componentPaths: ['src/components'],
      ignore: [],
      globalImports: ['./global.css'],
      hot: true,
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('adds global imports to entries', () => {
    cosmosConfig.globalImports.forEach((globalImport) => {
      expect(webpackConfig.entry).toContain(globalImport);
    });
  });

  test('adds cosmos entry with cosmos loader and module paths in loader query', () => {
    const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
    const loaderPath = require.resolve('../entry-loader');
    const entryPath = require.resolve('../entry');
    const stringifiedModules =
      '{"components":"__MOCK_COMPONENTS__","fixtures":"__MOCK_FIXTURES__"}';
    const entryMatcher = new RegExp(`^${loaderPath}\\?${stringifiedModules}!${entryPath}$`);
    expect(cosmosEntry).toMatch(entryMatcher);
  });

  test('adds hot middleware client to entries', () => {
    expect(webpackConfig.entry).toContain(require.resolve('webpack-hot-middleware/client'));
  });
});

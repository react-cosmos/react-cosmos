import path from 'path';

jest.mock('webpack');

const DefinePluginMock = {};
const DefinePlugin = jest.fn(() => DefinePluginMock);
const HotModuleReplacementPluginMock = {};
const HotModuleReplacementPlugin = jest.fn(() => HotModuleReplacementPluginMock);

let getWebpackConfig;

const cosmosConfigRelPath = './dummy-config/cosmos.config';
const cosmosConfigPath = require.resolve(cosmosConfigRelPath);

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

const resolveUserPath = relPath => path.join(path.dirname(cosmosConfigPath), relPath);

beforeEach(() => {
  // We want to change configs between test cases
  jest.resetModules();
  jest.clearAllMocks();

  // Mock user config
  jest.mock(cosmosConfigRelPath, () => cosmosConfig);

  require('webpack').__setPluginMock('DefinePlugin', DefinePlugin);
  require('webpack').__setPluginMock('HotModuleReplacementPlugin', HotModuleReplacementPlugin);

  getWebpackConfig = require('../webpack-config').default;
});

describe('without hmr', () => {
  beforeEach(() => {
    cosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
      ignore: [],
      globalImports: ['./global.css'],
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('keeps user loaders', () => {
    expect(webpackConfig.loaders).toBe(userWebpackConfig.loaders);
  });

  test('adds resolved global imports to entries', () => {
    cosmosConfig.globalImports.forEach((globalImport) => {
      expect(webpackConfig.entry).toContain(resolveUserPath(globalImport));
    });
  });

  test('adds resolved module paths in loader query', () => {
    const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
    const loaderPath = require.resolve('../entry-loader');
    const entryPath = require.resolve('../entry');
    const stringifiedPaths = JSON.stringify({
      componentPaths: cosmosConfig.componentPaths.map(resolveUserPath),
      fixturePaths: cosmosConfig.fixturePaths.map(resolveUserPath),
    });
    expect(cosmosEntry).toBe(`${loaderPath}?${stringifiedPaths}!${entryPath}`);
  });

  test('does not add hot middleware client to entries', () => {
    expect(webpackConfig.entry).not.toContain(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
    );
  });

  test('creates proper output', () => {
    expect(webpackConfig.output).toEqual({
      path: '/',
      filename: 'bundle.js',
      publicPath: '/loader/',
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
      fixturePaths: ['test/fixtures'],
      ignore: [],
      globalImports: ['./global.css'],
      hot: true,
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('adds resolved global imports to entries', () => {
    cosmosConfig.globalImports.forEach((globalImport) => {
      expect(webpackConfig.entry).toContain(resolveUserPath(globalImport));
    });
  });

  test('adds cosmos entry with cosmos loader and module paths in loader query', () => {
    const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
    const loaderPath = require.resolve('../entry-loader');
    const entryPath = require.resolve('../entry');
    const stringifiedPaths = JSON.stringify({
      componentPaths: cosmosConfig.componentPaths.map(resolveUserPath),
      fixturePaths: cosmosConfig.fixturePaths.map(resolveUserPath),
    });
    expect(cosmosEntry).toBe(`${loaderPath}?${stringifiedPaths}!${entryPath}`);
  });

  test('adds hot middleware client to entries', () => {
    expect(webpackConfig.entry).toContain(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
    );
  });
});

describe('with hmr plugin', () => {
  beforeEach(() => {
    cosmosConfig = {
      hmrPlugin: true,
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('adds HotModuleReplacementPlugin', () => {
    expect(webpackConfig.plugins).toContain(HotModuleReplacementPluginMock);
  });
});

describe('with absolute paths', () => {
  beforeEach(() => {
    cosmosConfig = {
      componentPaths: [resolveUserPath('src/components')],
      globalImports: [resolveUserPath('./global.css')],
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('adds user global imports to entries', () => {
    cosmosConfig.globalImports.forEach((globalImport) => {
      expect(webpackConfig.entry).toContain(globalImport);
    });
  });
});

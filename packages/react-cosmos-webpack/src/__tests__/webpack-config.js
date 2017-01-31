jest.mock('webpack');

const mockDefinePlugin = {};
const mockHotModuleReplacementPlugin = {};

let DefinePlugin;
let HotModuleReplacementPlugin;

let getWebpackConfig;

const cosmosConfigPath = '/mock/config/path';

// So far we use the same user webpack mock between all tests
const userWebpackConfig = {
  module: {
    rules: [],
  },
  plugins: [
    // fake plugins, something to compare identity with
    {}, {},
  ],
};

// This changes between test cases
let mockGetCosmosConfig;
let mockCosmosConfig;
// This is the output that we test
let webpackConfig;

beforeEach(() => {
  // We want to change configs between test cases
  jest.resetModules();
  jest.resetAllMocks();

  // Mock user config
  mockGetCosmosConfig = jest.fn(() => mockCosmosConfig);
  jest.mock('react-cosmos-config', () => mockGetCosmosConfig);

  DefinePlugin = jest.fn(() => mockDefinePlugin);
  HotModuleReplacementPlugin = jest.fn(() => mockHotModuleReplacementPlugin);

  require('webpack').__setPluginMock('DefinePlugin', DefinePlugin);
  require('webpack').__setPluginMock('HotModuleReplacementPlugin', HotModuleReplacementPlugin);

  getWebpackConfig = require('../webpack-config').default;
});

describe('without hmr', () => {
  beforeEach(() => {
    mockCosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
      ignore: [],
      globalImports: ['./global.css'],
      containerQuerySelector: '__mock__containerQuerySelector',
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('calls react-cosmos-config with config path', () => {
    expect(mockGetCosmosConfig.mock.calls[0][0]).toBe(cosmosConfigPath);
  });

  test('keeps user loaders', () => {
    expect(webpackConfig.rules).toBe(userWebpackConfig.rules);
  });

  test('adds resolved global imports to entries', () => {
    mockCosmosConfig.globalImports.forEach(globalImport => {
      expect(webpackConfig.entry).toContain(globalImport);
    });
  });

  test('adds cosmos entry', () => {
    const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
    expect(cosmosEntry).toBe(require.resolve('../entry'));
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
    userWebpackConfig.plugins.forEach(plugin => {
      expect(webpackConfig.plugins).toContain(plugin);
    });
  });

  test('calls define plugin with user config path', () => {
    expect(DefinePlugin.mock.calls[0][0]).toEqual({
      COSMOS_CONFIG: JSON.stringify({
        containerQuerySelector: '__mock__containerQuerySelector',
      }),
    });
  });

  test('adds DefinePlugin', () => {
    expect(webpackConfig.plugins).toContain(mockDefinePlugin);
  });

  test('adds module loader', () => {
    expect(webpackConfig.module.rules[webpackConfig.module.rules.length - 1]).toEqual({
      loader: require.resolve('../module-loader'),
      include: require.resolve('../user-modules'),
      query: {
        cosmosConfigPath,
      },
    });
  });
});

// Hmr setting affects entries, so only entry-related are duplicated here
describe('with hmr', () => {
  beforeEach(() => {
    mockCosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
      ignore: [],
      globalImports: ['./global.css'],
      hot: true,
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('adds resolved global imports to entries', () => {
    mockCosmosConfig.globalImports.forEach(globalImport => {
      expect(webpackConfig.entry).toContain(globalImport);
    });
  });

  test('adds cosmos entry', () => {
    test('adds cosmos entry', () => {
      const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
      expect(cosmosEntry).toBe(require.resolve('../entry'));
    });
  });

  test('adds hot middleware client to entries', () => {
    expect(webpackConfig.entry).toContain(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
    );
  });
});

describe('with hmr plugin', () => {
  beforeEach(() => {
    mockCosmosConfig = {
      globalImports: [],
      hmrPlugin: true,
    };
    webpackConfig = getWebpackConfig(userWebpackConfig, cosmosConfigPath);
  });

  test('adds HotModuleReplacementPlugin', () => {
    expect(webpackConfig.plugins).toContain(mockHotModuleReplacementPlugin);
  });
});

describe('webpack config basic', () => {
  test('choose `loaders` or `rules` from user config', () => {
    const userRule = { foo: 'bar' };

    webpackConfig = getWebpackConfig(
      {
        module: {
          rules: [userRule]
        }
      },
      cosmosConfigPath
    );
    expect(webpackConfig.module.rules[0]).toEqual(userRule);

    webpackConfig = getWebpackConfig(
      {
        module: {
          loaders: [userRule]
        }
      },
      cosmosConfigPath
    );
    expect(webpackConfig.module.loaders[0]).toEqual(userRule);
  });

  test('passing user data to module config', () => {
    const additionalOption = {
      something: 'foo',
    };
    const userRule = { foo: 'bar' };
    webpackConfig = getWebpackConfig(
      {
        module: {
          additionalOption,
          rules: [userRule],
        }
      },
      cosmosConfigPath
    );

    expect(webpackConfig.module.additionalOption).toEqual(additionalOption);
    expect(webpackConfig.module.rules[0]).toEqual(userRule);
  });
});

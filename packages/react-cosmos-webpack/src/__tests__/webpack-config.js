jest.mock('webpack');

const mockDefinePlugin = {};
const mockHotModuleReplacementPlugin = {};

let DefinePlugin;
let HotModuleReplacementPlugin;

let getWebpackConfig;

const cosmosConfigPath = '/mock/config/path';

const userLoader = {};
const userRule = {};
const userWebpack1Config = {
  module: {
    additionalOption: {
      something: 'foo',
    },
    loaders: [userLoader],
  },
};
const userWebpack2Config = {
  module: {
    additionalOption: {
      something: 'bar',
    },
    rules: [userRule],
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
    webpackConfig = getWebpackConfig(userWebpack2Config, cosmosConfigPath);
  });

  test('calls react-cosmos-config with config path', () => {
    expect(mockGetCosmosConfig.mock.calls[0][0]).toBe(cosmosConfigPath);
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

  test('keeps user plugins', () => {
    userWebpack2Config.plugins.forEach(plugin => {
      expect(webpackConfig.plugins).toContain(plugin);
    });
  });

  test('calls define plugin with NODE_ENV set to development', () => {
    expect(DefinePlugin.mock.calls[0][0]).toEqual({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      },
    });
  });

  test('calls define plugin with user config path', () => {
    expect(DefinePlugin.mock.calls[1][0]).toEqual({
      COSMOS_CONFIG: JSON.stringify({
        containerQuerySelector: '__mock__containerQuerySelector',
      }),
    });
  });

  test('adds DefinePlugin', () => {
    expect(webpackConfig.plugins).toContain(mockDefinePlugin);
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
    webpackConfig = getWebpackConfig(userWebpack2Config, cosmosConfigPath);
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
    webpackConfig = getWebpackConfig(userWebpack2Config, cosmosConfigPath);
  });

  test('adds HotModuleReplacementPlugin', () => {
    expect(webpackConfig.plugins).toContain(mockHotModuleReplacementPlugin);
  });
});

describe('loaders', () => {
  describe('webpack1', () => {
    beforeAll(() => {
      webpackConfig = getWebpackConfig(userWebpack1Config, cosmosConfigPath);
    });

    test('keeps user loaders', () => {
      expect(webpackConfig.module.loaders[0]).toBe(userLoader);
    });

    test('adds module loader to module.loaders', () => {
      expect(webpackConfig.module.loaders[webpackConfig.module.loaders.length - 1]).toEqual({
        loader: require.resolve('../module-loader'),
        include: require.resolve('../user-modules'),
        query: {
          cosmosConfigPath,
        },
      });
    });

    test('does not create module.rules', () => {
      expect(webpackConfig.module.rules).toBe(undefined);
    });

    test('preserves additional module options', () => {
      expect(webpackConfig.module.additionalOption).toEqual({
        something: 'foo',
      });
    });
  });

  describe('webpack2', () => {
    beforeAll(() => {
      webpackConfig = getWebpackConfig(userWebpack2Config, cosmosConfigPath);
    });

    test('keeps user rules', () => {
      expect(webpackConfig.module.rules[0]).toBe(userRule);
    });

    test('adds module loader to module.rules', () => {
      expect(webpackConfig.module.rules[webpackConfig.module.rules.length - 1]).toEqual({
        loader: require.resolve('../module-loader'),
        include: require.resolve('../user-modules'),
        query: {
          cosmosConfigPath,
        },
      });
    });

    test('does not create module.loaders', () => {
      expect(webpackConfig.module.loaders).toBe(undefined);
    });

    test('preserves additional module options', () => {
      expect(webpackConfig.module.additionalOption).toEqual({
        something: 'bar',
      });
    });
  });
});

describe('output', () => {
  beforeAll(() => {
    mockCosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
      ignore: [],
      globalImports: ['./global.css'],
      hot: true,
      outputPath: '__mock__outputPath'
    };
  });

  describe('with shouldExport false', () => {
    beforeAll(() => {
      webpackConfig = getWebpackConfig(userWebpack1Config, cosmosConfigPath);
    });

    test('creates proper output', () => {
      expect(webpackConfig.output).toEqual({
        path: '/',
        filename: 'bundle.js',
        publicPath: '/loader/',
      });
    });
  });

  describe('with shouldExport true', () => {
    beforeAll(() => {
      webpackConfig = getWebpackConfig(userWebpack1Config, cosmosConfigPath, true);
    });

    test('creates proper output', () => {
      expect(webpackConfig.output).toEqual({
        path: '__mock__outputPath',
        filename: 'bundle.js',
        publicPath: './',
      });
    });
  });
});

describe('with shouldExport true', () => {
  beforeEach(() => {
    mockCosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
      ignore: [],
      globalImports: ['./global.css'],
      hot: true,
      hmrPlugin: true,
      outputPath: '__mock__outputPath',
      containerQuerySelector: '__mock__containerQuerySelector'
    };
    webpackConfig = getWebpackConfig(userWebpack2Config, cosmosConfigPath, true);
  });

  test('does not add hot middleware client to entries', () => {
    expect(webpackConfig.entry).not.toContain(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`,
    );
  });

  test('does add NODE_ENV plugin as production ', () => {
    expect(DefinePlugin.mock.calls[0][0]).toEqual({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
    });
  });

  test('calls define plugin with user config path', () => {
    expect(DefinePlugin.mock.calls[1][0]).toEqual({
      COSMOS_CONFIG: JSON.stringify({
        containerQuerySelector: '__mock__containerQuerySelector',
      }),
    });
  });

  test('DefinePlugin should be called exactly twice total', () => {
    expect(DefinePlugin.mock.calls.length).toEqual(2);
  });

  test('adds DefinePlugin', () => {
    expect(webpackConfig.plugins).toContain(mockDefinePlugin);
  });
});

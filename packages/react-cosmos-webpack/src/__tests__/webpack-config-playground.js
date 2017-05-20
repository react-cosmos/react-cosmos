import webpack from 'webpack';
import getWebpackConfig from '../webpack-config-playground';

// Config changes between tests
let mockCosmosConfig;

const mockCosmosConfigPath = '/mock/config/path';
const mockFixtures = {
  C1: {
    f1: require.resolve('./mocks/fixture')
  }
};
const mockDefinePlugin = {};
const DefinePlugin = jest.fn(() => mockDefinePlugin);

jest.mock('react-cosmos-config', () => jest.fn(() => mockCosmosConfig));
jest.mock('react-cosmos-voyager', () => jest.fn(() => ({
  components: {},
  fixtures: mockFixtures
})));
jest.mock('webpack');

webpack.__setPluginMock('DefinePlugin', DefinePlugin);

// This is the output that we test
let webpackConfig;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('development mode', () => {
  beforeEach(() => {
    mockCosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
    };
    webpackConfig = getWebpackConfig(mockCosmosConfigPath);
  });

  test('adds playground entry', () => {
    expect(webpackConfig.entry).toBe(require.resolve('../entry-playground'));
  });

  test('creates absolute output', () => {
    expect(webpackConfig.output).toEqual({
      path: '/',
      filename: 'bundle.js',
      publicPath: '/',
    });
  });

  test('creates define plugin with serializable fixtures', () => {
    expect(DefinePlugin.mock.calls[0][0]).toEqual({
      COSMOS_FIXTURES: JSON.stringify({
        C1: {
          f1: {
            // ./mocks/fixture also contains a function that was omitted
            foo: 'bar'
          }
        }
      })
    });
  });

  test('adds DefinePlugin to plugin', () => {
    expect(webpackConfig.plugins).toContain(mockDefinePlugin);
  });
});

describe('export mode', () => {
  beforeEach(() => {
    mockCosmosConfig = {
      componentPaths: ['src/components'],
      fixturePaths: ['test/fixtures'],
      outputPath: '__mock__outputPath'
    };
    webpackConfig = getWebpackConfig(mockCosmosConfigPath, true);
  });

  test('creates relative output', () => {
    expect(webpackConfig.output).toEqual({
      path: '__mock__outputPath',
      filename: 'bundle.js',
      publicPath: './',
    });
  });
});

import webpack from 'webpack';
import enhanceWebpackConfig from '../../enhance-webpack-config';

const mockUserWebpackConfig = {};
const mockRule = {};
const mockPlugin = {};

const mockWebpackOverride = jest.fn(() => {
  // Note: Normally we extend the user config (1st argument) to keep existing
  // rules and plugins, as well as other module options
  return {
    module: {
      rules: [mockRule]
    },
    plugins: [mockPlugin]
  };
});

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: [],
    publicUrl: '/static/',
    webpack: mockWebpackOverride
  })
}));

const getConfig = () =>
  enhanceWebpackConfig({
    webpack,
    userWebpackConfig: mockUserWebpackConfig
  });

it('calls webpack override method with user config', () => {
  getConfig();
  const [overrideCall] = mockWebpackOverride.mock.calls;
  expect(overrideCall[0]).toBe(mockUserWebpackConfig);
});

it('calls webpack override method with env', () => {
  getConfig();
  const [overrideCall] = mockWebpackOverride.mock.calls;
  expect(overrideCall[1].env).toContain(process.env.NODE_ENV);
});

it('returns webpack config with added rule', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.module.rules).toContain(mockRule);
});

it('returns webpack config with added plugin', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.plugins).toContain(mockPlugin);
});

it('keeps core user-modules loader', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.module.rules).toContainEqual({
    loader: require.resolve('../../embed-modules-webpack-loader'),
    include: require.resolve('../../../../../client/user-modules')
  });
});

it('keeps DefinePlugin with process.env.NODE_ENV', () => {
  const webpackConfig = getConfig();
  expect(
    getDefinePlugins(webpackConfig).filter(
      p => p.definitions['process.env'] && p.definitions['process.env'].NODE_ENV
    )
  ).toHaveLength(1);
});

it('keeps DefinePlugin with COSMOS_CONFIG', () => {
  const webpackConfig = getConfig();
  expect(
    getDefinePlugins(webpackConfig).filter(p => p.definitions.COSMOS_CONFIG)
  ).toHaveLength(1);
});

function getDefinePlugins({ plugins }) {
  return plugins.filter(
    p => p.constructor && p.constructor.name === 'DefinePlugin'
  );
}

import extendWebpackConfig from '../../extend-webpack-config';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: [],
    publicUrl: '/'
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

const userLoader = {};
const getConfig = () =>
  extendWebpackConfig({
    webpack,
    userWebpackConfig: {
      module: {
        additionalOption: 'foo',
        loaders: [userLoader]
      }
    }
  });

beforeEach(() => {
  jest.clearAllMocks();
});

it('keeps user loaders', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.module.loaders).toContain(userLoader);
});

it('adds module loader to module.loaders', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.module.loaders).toContainEqual({
    loader: require.resolve('../../embed-modules-webpack-loader'),
    include: require.resolve('../../../../client/user-modules')
  });
});

it('does not create module.rules', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.module.rules).toBe(undefined);
});

it('preserves additional module options', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.module.additionalOption).toEqual('foo');
});

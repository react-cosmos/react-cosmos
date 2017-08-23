import webpack from 'webpack';
import getWebpackConfig from '../loader-webpack-config';

// Mocking 3rd part deps is too much work. Let's only do it when it's necessary
// from now on
jest.unmock('webpack');

const getHmrPlugins = plugins =>
  plugins.filter(
    p => p.constructor && p.constructor.name === 'HotModuleReplacementPlugin'
  );

describe('Loader webpack hmr', () => {
  beforeEach(() => {});

  test('adds HotModuleReplacementPlugin', () => {
    const userWebpackConfig = {};
    const webpackConfig = getWebpackConfig(
      userWebpackConfig,
      require.resolve('./mocks/cosmos.config')
    );
    expect(getHmrPlugins(webpackConfig.plugins)).toHaveLength(1);
  });

  test('does not duplicate HotModuleReplacementPlugin', () => {
    const userWebpackConfig = {
      plugins: [new webpack.HotModuleReplacementPlugin()]
    };
    const webpackConfig = getWebpackConfig(
      userWebpackConfig,
      require.resolve('./mocks/cosmos.config')
    );
    expect(getHmrPlugins(webpackConfig.plugins)).toHaveLength(1);
  });
});

import webpack from 'webpack';
import enhanceWebpackConfig from '../../enhance-webpack-config';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: ['./global.css'],
    publicUrl: '/',
    hot: true
  })
}));

const getConfig = () =>
  enhanceWebpackConfig({
    webpack,
    userWebpackConfig: {
      plugins: [new webpack.HotModuleReplacementPlugin()]
    }
  });

const getHmrPlugins = plugins =>
  plugins.filter(
    p => p.constructor && p.constructor.name === 'HotModuleReplacementPlugin'
  );

it('does not duplicate HotModuleReplacementPlugin', () => {
  const webpackConfig = getConfig();
  expect(getHmrPlugins(webpackConfig.plugins)).toHaveLength(1);
});

import webpack from 'webpack';
import extendWebpackConfig from '../../extend-webpack-config';

jest.mock('react-cosmos-config', () => () => ({
  componentPaths: ['src/components'],
  fixturePaths: ['test/fixtures'],
  ignore: [],
  globalImports: ['./global.css'],
  hot: true
}));

const getConfig = () =>
  extendWebpackConfig({
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

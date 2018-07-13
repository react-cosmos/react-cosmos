import webpack from 'webpack';
import enhanceWebpackConfig from '../../enhance-webpack-config';
import HtmlWebpackPlugin from 'html-webpack-plugin';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: [],
    publicUrl: '/'
  })
}));

const getConfig = () =>
  enhanceWebpackConfig({
    webpack,
    userWebpackConfig: {
      plugins: [new HtmlWebpackPlugin()]
    }
  });

it('replaces the filename of html-webpack-plugin to _loader.html', () => {
  const webpackConfig = getConfig();
  const htmlPlugin = getHtmlWebpackPlugin(webpackConfig);
  expect(htmlPlugin.options.filename).toBe('_loader.html');
});

function getHtmlWebpackPlugin({ plugins }) {
  return plugins.find(
    p => p.constructor && p.constructor.name === 'HtmlWebpackPlugin'
  );
}

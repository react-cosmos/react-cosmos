// @flow

import webpack from 'webpack';
import enhanceWebpackConfig from '../../enhance-webpack-config';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    globalImports: [],
    publicUrl: '/'
  })
}));

const getConfig = () =>
  enhanceWebpackConfig({
    webpack,
    userWebpackConfig: {
      plugins: []
    }
  });

it('adds html-webpack-plugin', () => {
  const webpackConfig = getConfig();
  const htmlPlugin = getHtmlWebpackPlugin(webpackConfig);
  expect(htmlPlugin).toBeTruthy();
});

it('sets the filename of html-webpack-plugin to _loader.html', () => {
  const webpackConfig = getConfig();
  const htmlPlugin = getHtmlWebpackPlugin(webpackConfig);
  expect(htmlPlugin.options.filename).toBe('_loader.html');
});

function getHtmlWebpackPlugin({ plugins }) {
  return plugins.find(
    p => p.constructor && p.constructor.name === 'HtmlWebpackPlugin'
  );
}

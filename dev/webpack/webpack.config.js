const path = require('path');
const webpack = require('webpack');
const postCssNested = require('postcss-nested');

const rootDir = path.join(__dirname, '..');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'index'),
  ],
  output: {
    path: path.join(__dirname),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      COSMOS_COMPONENTS_PATH: path.join(rootDir, 'components'),
      COSMOS_FIXTURES_PATH: path.join(rootDir, 'fixtures'),
    },
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: rootDir,
      query: {
        presets: ['es2015', 'react'],
        env: {
          development: {
            presets: ['react-hmre'], // Remove to work with older React versions
          },
        },
      },
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader',
      include: rootDir,
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  postcss() {
    return [postCssNested];
  },
};

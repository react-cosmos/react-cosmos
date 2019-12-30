const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

const env = process.env.NODE_ENV || 'development';
const { version } = require('../lerna.json');

module.exports = {
  mode: env,
  entry: [path.join(src, 'index')],
  output: {
    path: dist,
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, include: [src], loader: 'babel-loader' },
      { test: /\.css$/, include: src, loader: 'style-loader!css-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      RC_VERSION: JSON.stringify(version)
    })
  ]
};

if (env === 'development') {
  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      template: path.join(src, 'index.dev.html')
    })
  );
}

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.join(__dirname, 'src');
const dist = path.join(__dirname, 'dist');

const env = process.env.NODE_ENV || 'development';

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
  }
};

if (env === 'development') {
  module.exports.plugins = [
    new HtmlWebpackPlugin({
      template: path.join(src, 'index.dev.html')
    })
  ];
}

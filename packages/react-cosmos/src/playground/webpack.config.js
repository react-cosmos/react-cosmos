const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = join(__dirname, '../../dist/playground');
const dist = join(__dirname, '../../dist/playground');

const env = process.env.NODE_ENV || 'development';
const plugins = [];

if (env === 'development') {
  // Used by Cosmos config (when loading Playground inside Playground)
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'React Cosmos',
    })
  );
}

module.exports = {
  mode: env,
  devtool: false,
  entry: src,
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'index.bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins,
};
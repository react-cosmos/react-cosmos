const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  entry: dist,
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'index.bundle.js',
  },
  plugins,
};

/* eslint-env node */
// @flow

const { join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = join(__dirname, 'src');
const dist = join(__dirname, 'dist');

const env = process.env.NODE_ENV || 'development';
const plugins = [];

if (env === 'development') {
  // Used by Cosmos config (when loading Playground inside Playground)
  plugins.push(
    new HtmlWebpackPlugin({
      title: 'React Cosmos'
    })
  );
}

module.exports = {
  mode: env,
  // Besides other advantages, cheap-module-source-map is compatible with
  // React.componentDidCatch https://github.com/facebook/react/issues/10441
  devtool: 'cheap-module-source-map',
  entry: [src],
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          src,
          // Allow building playground from uncompiled monorepo deps
          /(react-cosmos[a-z0-9-]*|react-querystring-router)(\/|\\)src/
        ],
        use: 'babel-loader'
      }
    ]
  },
  plugins
};

const { join } = require('path');

const dist = join(__dirname, '../../dist/playground');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  devtool: false,
  entry: dist,
  module: {
    rules: [{ test: /\.js/, resolve: { fullySpecified: false } }],
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'index.bundle.js',
  },
};

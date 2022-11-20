const path = require('path');

const dist = path.join(__dirname, './dist');
const entry = path.join(__dirname, './dist/playground.js');

const env = process.env.NODE_ENV || 'development';

module.exports = {
  mode: env,
  devtool: false,
  entry,
  module: {
    rules: [{ test: /\.js/, resolve: { fullySpecified: false } }],
  },
  output: {
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'mountPlayground',
    path: dist,
    filename: 'playground.bundle.js',
  },
};

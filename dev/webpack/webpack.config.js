const path = require('path');
const webpack = require('webpack');

const examplePath = path.join(__dirname, '../../example');

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
    extensions: ['', '.js', '.jsx'],
    alias: {
      COSMOS_COMPONENTS_PATH: path.join(examplePath, 'src/components'),
      COSMOS_FIXTURES_PATH: path.join(examplePath, 'fixtures'),
    },
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
        env: {
          development: {
            presets: ['react-hmre'], // Remove to work with older React versions
          },
        },
      },
    }, {
      test: /\.(css|less)$/,
      loader: 'style!css!less',
      exclude: /node_modules/,
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};

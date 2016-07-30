var path = require('path'),
    webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      query: {
        presets: ['es2015', 'stage-0', 'react'],
        env: {
          development: {
            presets: ['react-hmre']
          }
        }
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader',
      include: path.join(__dirname, 'src')
    }]
  },
  postcss: function() {
    return [require('postcss-nested')];
  }
};

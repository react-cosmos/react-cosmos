var path = require('path'),
    webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, 'playground/client')
  ],
  resolve: {
    alias: {
      COSMOS_COMPONENTS: path.join(__dirname, 'src/components'),
      COSMOS_FIXTURES: path.join(__dirname, 'fixtures')
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader'
    }]
  },
  output: {
    libraryTarget: 'umd',
    library: 'cosmosRouter',
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  postcss: function() {
    return [require('postcss-nested')];
  }
};

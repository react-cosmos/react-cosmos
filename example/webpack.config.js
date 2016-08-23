var path = require('path'),
    webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    // Replace with 'react-cosmos' in real life
    './packages/react-cosmos'
  ],
  output: {
    path: path.join(__dirname),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      COSMOS_COMPONENTS: path.join(__dirname, 'components'),
      COSMOS_FIXTURES: path.join(__dirname, 'fixtures')
    }
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: __dirname,
      query: {
        presets: ['es2015', 'react'],
        env: {
          development: {
            presets: ['react-hmre'] // Remove to work with older React versions
          }
        }
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader',
      include: __dirname
    }, {
      test: /\.less$/,
      include: /component-playground\.less/,
      loader: 'style!css?modules&importLoaders=1' +
              '&localIdentName=[name]__[local]___[hash:base64:5]!less'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  postcss: function() {
    return [require('postcss-nested')];
  }
};

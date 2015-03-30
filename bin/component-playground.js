var path = require('path'),
    WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack');

var PLAYGROUND_PATH = path.join(__dirname, '..', 'component-playground');

var compiler = webpack({
  entry: PLAYGROUND_PATH + '/entry.js',
  resolve: {
    // Draw components and fixtures from the current folder
    root: process.cwd()
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  output: {
    path: path.join(PLAYGROUND_PATH, 'build'),
    libraryTarget: 'var',
    library: 'cosmosRouter',
    filename: 'bundle.js'
  }
});

var server = new WebpackDevServer(compiler, {
  contentBase: path.join(PLAYGROUND_PATH, 'public'),
  publicPath: '/assets/',
});

server.listen(8989, 'localhost', function() {});

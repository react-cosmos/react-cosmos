var path = require('path'),
    WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack');

var PLAYGROUND_PATH = path.resolve('./component-playground');

var compiler = webpack({
  entry: PLAYGROUND_PATH + '/entry.js',
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

server.listen(8080, 'localhost', function() {});

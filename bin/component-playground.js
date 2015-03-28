var path = require('path'),
    fs = require('fs'),
    WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack');

var PLAYGROUND_PATH = path.join(__dirname, '..', 'component-playground'),
    CONFIG_PATH = path.resolve('./component-playground.config.js');

// Link playground config to user config from current folder
fs.writeFileSync(path.join(PLAYGROUND_PATH, 'config.js'),
                 'module.exports = require("' + CONFIG_PATH + '");')

var compiler = webpack({
  entry: PLAYGROUND_PATH + '/entry.js',
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader'
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

server.listen(8080, 'localhost', function() {});

var path = require('path'),
    argv = require('yargs').argv,
    _ = require('lodash'),
    webpack = require('webpack');

var playgroundPath = __dirname,
    rootPath = path.join(playgroundPath, '..'),
    modulesPath = path.join(rootPath, 'node_modules'),
    cwd = process.cwd();

var resolvePath = function(userPath) {
  return path.resolve(cwd, userPath);
};

var config = {},
    userConfig;

try {
  userConfig = require(
    resolvePath(argv.configPath || 'component-playground.config'));
} catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
    userConfig = {};
  } else {
    throw e;
  }
}

config.server = _.extend({
  port: 8989,
  hostname: 'localhost'
}, userConfig.server);

config.webpack = {
  context: playgroundPath,
  entry: [
    'webpack-dev-server/client?http://' + config.server.hostname + ':' +
                                          config.server.port,
    'webpack/hot/dev-server',
    './entry'
  ],
  resolve: {
    alias: {
      components: resolvePath(argv.componentsPath || 'components'),
      fixtures: resolvePath(argv.fixturesPath || 'fixtures')
    },
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    root: modulesPath
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['react-hot-loader', 'babel-loader']
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    }]
  },
  output: {
    libraryTarget: 'umd',
    library: 'cosmosRouter',
    path: path.join(playgroundPath, 'public', 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

if (userConfig.webpack) {
  config.webpack = userConfig.webpack(config.webpack);
}

module.exports = config;

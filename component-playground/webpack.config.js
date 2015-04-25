var path = require('path'),
    argv = require('yargs').argv;

var playgroundPath = __dirname,
    rootPath = path.join(playgroundPath, '..'),
    modulesPath = path.join(rootPath, 'node_modules'),
    cwd = process.cwd();

var resolvePath = function(userPath) {
  return path.resolve(cwd, userPath);
};

module.exports = {
  entry: path.join(playgroundPath, 'entry.js'),
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
      loader: 'jsx-loader?harmony'
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
    filename: 'bundle.js'
  }
};

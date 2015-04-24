var path = require('path'),
    argv = require('yargs').argv;

var playgroundPath = __dirname,
    cwd = process.cwd();

var getAbsPath = function(relativePath) {
  return path.join(cwd, relativePath);
};

module.exports = {
  entry: path.join(playgroundPath, 'entry.js'),
  resolve: {
    alias: {
      components: getAbsPath(argv.componentsPath || 'components'),
      fixtures: getAbsPath(argv.fixturesPath || 'fixtures')
    },
    extensions: ['', '.js', '.jsx']
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

var path = require('path'),
    argv = require('yargs').argv;

var playgroundPath = __dirname,
    rootPath = path.join(playgroundPath, '..'),
    modulesPath = path.join(rootPath, 'node_modules');

module.exports = {
  entry: path.join(playgroundPath, 'entry.js'),
  resolve: {
    // Draw components and fixtures from the current folder...
    root: process.cwd(),
    fallback: modulesPath,
    alias: {
      components: argv.componentsPath || 'components',
      fixtures: argv.fixturesPath || 'fixtures'
    },
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    root: modulesPath
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader!jsx-loader'
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
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

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
    }
  },
  resolveLoader: {
    root: modulesPath
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
    libraryTarget: 'umd',
    library: 'cosmosRouter',
    path: path.join(playgroundPath, 'public', 'build'),
    filename: 'bundle.js'
  }
};

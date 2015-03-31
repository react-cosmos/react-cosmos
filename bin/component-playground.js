#!/usr/bin/env node

var path = require('path'),
    argv = require('yargs').argv,
    WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack');

var rootPath = path.join(__dirname, '..'),
    modulesPath = path.join(rootPath, 'node_modules'),
    playgroundPath = path.join(rootPath, 'component-playground');

var compiler = webpack({
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
    path: path.join(playgroundPath, 'build'),
    libraryTarget: 'var',
    library: 'cosmosRouter',
    filename: 'bundle.js'
  }
});

var server = new WebpackDevServer(compiler, {
  contentBase: path.join(playgroundPath, 'public'),
  publicPath: '/assets/',
});

server.listen(8989, 'localhost', function() {});

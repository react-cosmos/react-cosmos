#!/usr/bin/env node

var path = require('path'),
    WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack');

var rootPath = path.join(__dirname, '..'),
    playgroundPath = path.join(rootPath, 'component-playground');

var config = require(path.join(playgroundPath, 'config'));
var compiler = webpack(userConfig.webpack);

var server = new WebpackDevServer(compiler, {
  contentBase: path.join(playgroundPath, 'public'),
  publicPath: '/build/',
  hot: true
});

server.listen(config.server.port, config.server.hostname, function() {});

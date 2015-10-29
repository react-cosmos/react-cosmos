#!/usr/bin/env node

var path = require('path'),
    express = require('express'),
    webpack = require('webpack');

var hostname = 'localhost',
    port = 8989;

var webpackConfig = require('./webpack.config.playground'),
    compiler = webpack(webpackConfig),
    app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'playground/index.html'));
});

app.listen(port, hostname, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at ' + hostname + ':' + port);
});

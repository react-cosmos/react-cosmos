const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const host = 'localhost';
const port = 8989;

const compiler = webpack(webpackConfig);
const app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, host, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + host + ':' + port);
});

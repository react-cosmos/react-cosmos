var path = require('path'),
    express = require('express'),
    webpack = require('webpack');

var host = 'localhost';
var port = 8989;

var webpackConfig = require('./webpack.config'),
    compiler = webpack(webpackConfig),
    app = express();

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, host, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at ' + host + ':' + port);
});

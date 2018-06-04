'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = startServer;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _importFrom = require('import-from');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _launchEditor = require('react-dev-utils/launchEditor');

var _launchEditor2 = _interopRequireDefault(_launchEditor);

var _reactCosmosConfig = require('react-cosmos-config');

var _extendWebpackConfig = require('./extend-webpack-config');

var _extendWebpackConfig2 = _interopRequireDefault(_extendWebpackConfig);

var _userWebpackConfig = require('./user-webpack-config');

var _playgroundHtml = require('./playground-html');

var _playgroundHtml2 = _interopRequireDefault(_playgroundHtml);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var getPublicPath = function getPublicPath(cosmosConfig, userWebpackConfig) {
  return (
    cosmosConfig.publicPath ||
    (userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase)
  );
};

function startServer() {
  if (!(0, _reactCosmosConfig.hasUserCosmosConfig)()) {
    var generatedConfigFor = (0, _reactCosmosConfig.generateCosmosConfig)();
    if (generatedConfigFor) {
      console.log("[Cosmos] Nice! You're using " + generatedConfigFor);
      console.log('[Cosmos] Generated a tailored config file for your setup');
    }
  }

  var cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)();
  var rootPath = cosmosConfig.rootPath,
    hostname = cosmosConfig.hostname,
    hot = cosmosConfig.hot,
    port = cosmosConfig.port,
    publicUrl = cosmosConfig.publicUrl,
    httpProxy = cosmosConfig.httpProxy;

  var webpack = (0, _importFrom.silent)(rootPath, 'webpack');
  if (!webpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  if (cosmosConfig.proxies) {
    console.warn('[Cosmos] Warning: config.proxies is deprecated!');
    console.warn(
      'Please check latest proxy docs: https://github.com/react-cosmos/react-cosmos#proxies'
    );
  }

  var userWebpackConfig = (0, _userWebpackConfig.getUserWebpackConfig)(
    cosmosConfig
  );
  var loaderWebpackConfig = (0, _extendWebpackConfig2.default)({
    webpack: webpack,
    userWebpackConfig: userWebpackConfig
  });
  var loaderCompiler = webpack(loaderWebpackConfig);
  var app = (0, _express2.default)();

  if (httpProxy) {
    var context = httpProxy.context,
      target = httpProxy.target;

    app.use(context, (0, _httpProxyMiddleware2.default)(target));
  }

  app.use(
    (0, _webpackDevMiddleware2.default)(loaderCompiler, {
      publicPath: '/loader/',
      noInfo: true
    })
  );

  if (hot) {
    app.use((0, _webpackHotMiddleware2.default)(loaderCompiler));
  }

  var publicPath = getPublicPath(cosmosConfig, userWebpackConfig);
  if (publicPath) {
    var relPublicPath = _path2.default.relative(process.cwd(), publicPath);
    console.log('[Cosmos] Serving static files from ' + relPublicPath);
    app.use(publicUrl, _express2.default.static(publicPath));
  }

  var playgroundHtml = (0, _playgroundHtml2.default)(cosmosConfig);
  app.get('/', function(req, res) {
    res.send(playgroundHtml);
  });

  app.get('/bundle.js', function(req, res) {
    res.sendFile(require.resolve('react-cosmos-playground'));
  });

  app.get('/favicon.ico', function(req, res) {
    res.sendFile(_path2.default.join(__dirname, 'static/favicon.ico'));
  });

  app.get('/__open-stack-frame-in-editor', function(req, res) {
    (0, _launchEditor2.default)(req.query.fileName, req.query.lineNumber);
    res.end();
  });

  app.listen(port, hostname, function(err) {
    if (err) {
      throw err;
    }
    console.log('[Cosmos] See you at http://' + hostname + ':' + port + '/');
  });
}

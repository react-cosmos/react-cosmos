'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = getPlaygroundHtml;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _userWebpackConfig = require('./user-webpack-config');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getPlaygroundHtml(cosmosConfig) {
  var rootPath = cosmosConfig.rootPath,
    responsiveDevices = cosmosConfig.responsiveDevices;

  var html = _fs2.default.readFileSync(
    _path2.default.join(__dirname, 'static/index.html'),
    'utf8'
  );
  var opts = {
    loaderUri: './loader/index.html',
    projectKey: rootPath,
    responsiveDevices: responsiveDevices,
    webpackConfigType: (0, _userWebpackConfig.hasUserCustomWebpackConfig)(
      cosmosConfig
    )
      ? 'custom'
      : 'default'
  };

  return html.replace('__PLAYGROUND_OPTS__', JSON.stringify(opts));
}

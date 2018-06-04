'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getUserWebpackConfig = getUserWebpackConfig;
exports.hasUserCustomWebpackConfig = hasUserCustomWebpackConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _reactCosmosShared = require('react-cosmos-shared');

var _server = require('react-cosmos-shared/lib/server');

var _defaultWebpackConfig = require('./default-webpack-config');

var _defaultWebpackConfig2 = _interopRequireDefault(_defaultWebpackConfig);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getUserWebpackConfig(cosmosConfig) {
  var rootPath = cosmosConfig.rootPath,
    webpackConfigPath = cosmosConfig.webpackConfigPath;

  if (hasUserCustomWebpackConfig(cosmosConfig)) {
    var relPath = _path2.default.relative(process.cwd(), webpackConfigPath);
    console.log('[Cosmos] Using webpack config found at ' + relPath);
    return (0, _reactCosmosShared.importModule)(require(webpackConfigPath));
  }

  console.log('[Cosmos] No webpack config found, using defaults');
  return (0, _defaultWebpackConfig2.default)(rootPath);
}

function hasUserCustomWebpackConfig(cosmosConfig) {
  return (0, _server.moduleExists)(cosmosConfig.webpackConfigPath);
}

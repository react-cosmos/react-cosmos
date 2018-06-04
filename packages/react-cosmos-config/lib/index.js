'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.getCosmosConfig = getCosmosConfig;
exports.hasUserCosmosConfig = hasUserCosmosConfig;
exports.generateCosmosConfig = generateCosmosConfig;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _reactCosmosShared = require('react-cosmos-shared');

var _server = require('react-cosmos-shared/lib/server');

var _log = require('./log');

var _configTemplates = require('./config-templates');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaults = {
  rootPath: '.',
  fileMatch: _server.defaultFileMatch,
  exclude: _server.defaultExclude,
  globalImports: [],
  hostname: 'localhost',
  hot: true,
  port: 8989,
  proxiesPath: 'cosmos.proxies',
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export',
  publicUrl: '/loader/',
  responsiveDevices: [
    { label: 'iPhone 5', width: 320, height: 568 },
    { label: 'iPhone 6', width: 375, height: 667 },
    { label: 'iPhone 6 Plus', width: 414, height: 736 },
    { label: 'Medium', width: 1024, height: 768 },
    { label: 'Large', width: 1440, height: 900 },
    { label: '1080p', width: 1920, height: 1080 }
  ],
  // Deprecated
  componentPaths: [],
  ignore: [],
  fixturesDir: '__fixtures__',
  fixturePaths: []
};

function getCosmosConfig(cosmosConfigPath) {
  var configPath = getUserConfigPath(cosmosConfigPath);
  var relPath = _path2.default.dirname(configPath);

  if (!configExist(configPath)) {
    if (_yargs.argv.config) {
      var _relPath = _path2.default.relative(process.cwd(), configPath);
      (0, _log.warn)(
        '[Cosmos] No config file found at ' + _relPath + ', using defaults'
      );
    } else {
      (0, _log.log)('[Cosmos] No config file found, using defaults');
    }

    return getNormalizedConfig(defaults, relPath);
  }

  var userConfig = (0, _reactCosmosShared.importModule)(require(configPath));
  var config = (0, _extends3.default)({}, defaults, userConfig);

  return getNormalizedConfig(config, relPath);
}

function hasUserCosmosConfig() {
  return configExist(getUserConfigPath());
}

function generateCosmosConfig() {
  // Warning: This code assumes the user hasn't created cosmos.config by now
  var configPath = getUserConfigPath();
  var rootPath = _path2.default.dirname(configPath);
  var craWebpackConfigPath = 'react-scripts/config/webpack.config.dev';

  if (
    (0, _server.moduleExists)(
      (0, _server.resolveUserPath)(rootPath, craWebpackConfigPath)
    )
  ) {
    _fs2.default.writeFileSync(
      configPath,
      _configTemplates.CRA_COSMOS_CONFIG,
      'utf8'
    );

    return 'Create React App';
  }
}

function getUserConfigPath(customConfigPath) {
  var loosePath = _path2.default.resolve(
    process.cwd(),
    customConfigPath || _yargs.argv.config || 'cosmos.config.js'
  );

  // Ensure path has file extension
  return loosePath.match(/\.js$/) ? loosePath : loosePath + '.js';
}

function configExist(path) {
  // Only resolve config path once we know it exists, otherwise the path will
  // be cached to a missing module for the rest of the process execution.
  // This allows us to generate the config at run time and import it later.
  return _fs2.default.existsSync(path);
}

function getNormalizedConfig(relativeConfig, relPath) {
  var globalImports = relativeConfig.globalImports,
    outputPath = relativeConfig.outputPath,
    proxiesPath = relativeConfig.proxiesPath,
    publicPath = relativeConfig.publicPath,
    webpackConfigPath = relativeConfig.webpackConfigPath,
    responsiveDevices = relativeConfig.responsiveDevices,
    componentPaths = relativeConfig.componentPaths,
    fixturePaths = relativeConfig.fixturePaths;

  var rootPath = _path2.default.resolve(relPath, relativeConfig.rootPath);
  var config = (0, _extends3.default)({}, relativeConfig, {
    rootPath: rootPath,
    globalImports: globalImports.map(function(p) {
      return (0, _server.resolveUserPath)(rootPath, p);
    }),
    outputPath: _path2.default.resolve(rootPath, outputPath),
    proxiesPath: (0, _server.resolveUserPath)(rootPath, proxiesPath),
    webpackConfigPath: (0, _server.resolveUserPath)(
      rootPath,
      webpackConfigPath
    ),
    // Deprecated
    componentPaths: componentPaths.map(function(p) {
      return _path2.default.resolve(rootPath, p);
    }),
    fixturePaths: fixturePaths.map(function(p) {
      return _path2.default.resolve(rootPath, p);
    })
  });

  if (publicPath) {
    config.publicPath = _path2.default.resolve(rootPath, publicPath);
  }

  return config;
}

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = startExport;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _importFrom = require('import-from');

var _extendWebpackConfig = require('./extend-webpack-config');

var _extendWebpackConfig2 = _interopRequireDefault(_extendWebpackConfig);

var _reactCosmosConfig = require('react-cosmos-config');

var _userWebpackConfig = require('./user-webpack-config');

var _playgroundHtml = require('./playground-html');

var _playgroundHtml2 = _interopRequireDefault(_playgroundHtml);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var exportPlaygroundFiles = function exportPlaygroundFiles(
  cosmosConfig,
  outputPath
) {
  _fsExtra2.default.copySync(
    _path2.default.join(__dirname, 'static/favicon.ico'),
    outputPath + '/favicon.ico'
  );

  _fsExtra2.default.copySync(
    require.resolve('react-cosmos-playground'),
    outputPath + '/bundle.js'
  );

  var playgroundHtml = (0, _playgroundHtml2.default)(cosmosConfig);
  _fsExtra2.default.writeFileSync(outputPath + '/index.html', playgroundHtml);
};

var runWebpackCompiler = function runWebpackCompiler(webpack, config) {
  return new Promise(function(resolve, reject) {
    var compiler = webpack(config);
    compiler.run(function(err, stats) {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};

function startExport() {
  var cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)();
  var rootPath = cosmosConfig.rootPath,
    outputPath = cosmosConfig.outputPath,
    publicPath = cosmosConfig.publicPath,
    publicUrl = cosmosConfig.publicUrl;

  var webpack = (0, _importFrom.silent)(rootPath, 'webpack');
  if (!webpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return;
  }

  var userWebpackConfig = (0, _userWebpackConfig.getUserWebpackConfig)(
    cosmosConfig
  );
  var loaderWebpackConfig = (0, _extendWebpackConfig2.default)({
    webpack: webpack,
    userWebpackConfig: userWebpackConfig,
    shouldExport: true
  });

  // Copy static files first, so that the built index.html overrides the its
  // template file (in case the static assets are served from the root path)
  if (publicPath) {
    if (outputPath.indexOf(publicPath) === -1) {
      var exportPublicPath = _path2.default.join(outputPath, publicUrl);
      _fsExtra2.default.copySync(publicPath, exportPublicPath);
    } else {
      console.warn(
        "[Cosmos] Warning: Can't export public path because it contains the export path! (avoiding infinite loop)"
      );
      console.warn('Public path:', publicPath);
      console.warn('Export path:', outputPath);
    }
  }

  runWebpackCompiler(webpack, loaderWebpackConfig)
    .then(function() {
      exportPlaygroundFiles(cosmosConfig, outputPath);
    })
    .then(
      function() {
        console.log('[Cosmos] Export Complete! Find the exported files here:');
        console.log(outputPath);
      },
      function(err) {
        console.error('[Cosmos] Export Failed! See error below:');
        console.error(err);
      }
    );
}

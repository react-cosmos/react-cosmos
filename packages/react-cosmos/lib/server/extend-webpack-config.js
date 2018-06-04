'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = extendWebpackConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactCosmosConfig = require('react-cosmos-config');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Extend the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the config path to make user configs available on the client-side
 */
function extendWebpackConfig(_ref) {
  var webpack = _ref.webpack,
    userWebpackConfig = _ref.userWebpackConfig,
    _ref$shouldExport = _ref.shouldExport,
    shouldExport = _ref$shouldExport === undefined ? false : _ref$shouldExport;

  var cosmosConfig = (0, _reactCosmosConfig.getCosmosConfig)();

  var containerQuerySelector = cosmosConfig.containerQuerySelector,
    globalImports = cosmosConfig.globalImports,
    hot = cosmosConfig.hot,
    outputPath = cosmosConfig.outputPath;

  var entry = [].concat((0, _toConsumableArray3.default)(globalImports));

  if (hot && !shouldExport) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(
      require.resolve('webpack-hot-middleware/client') +
        '?reload=true&overlay=false'
    );
  }

  entry.push(require.resolve('../client/loader-entry'));

  var output = {
    path: shouldExport ? outputPath + '/loader/' : '/loader/',
    filename: '[name].js',
    publicPath: shouldExport ? './' : '/loader/'
  };

  // Exports are generally meant to run outside of the developer's machine
  if (!shouldExport) {
    // Enable click-to-open source
    output = (0, _extends4.default)({}, output, {
      devtoolModuleFilenameTemplate: function devtoolModuleFilenameTemplate(
        info
      ) {
        return _path2.default
          .resolve(info.absoluteResourcePath)
          .replace(/\\/g, '/');
      }
    });
  }

  // To support webpack 1 and 2 configuration formats. So we use the one that user passes
  var webpackRulesOptionName =
    userWebpackConfig.module && userWebpackConfig.module.rules
      ? 'rules'
      : 'loaders';
  var rules =
    userWebpackConfig.module && userWebpackConfig.module[webpackRulesOptionName]
      ? [].concat(
          (0, _toConsumableArray3.default)(
            userWebpackConfig.module[webpackRulesOptionName]
          )
        )
      : [];
  var plugins = userWebpackConfig.plugins
    ? [].concat((0, _toConsumableArray3.default)(userWebpackConfig.plugins))
    : [];

  rules.push({
    loader: require.resolve('./embed-modules-webpack-loader'),
    include: require.resolve('../client/user-modules')
  });

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(shouldExport ? 'production' : 'development')
      }
    }),
    new webpack.DefinePlugin({
      COSMOS_CONFIG: JSON.stringify({
        // Config options that are available inside the client bundle. Warning:
        // Must be serializable!
        containerQuerySelector: containerQuerySelector
      })
    }),
    // Important: Without this webpack tries to apply hot updates for broken
    // builds and results in duplicate React nodes attached
    // See https://github.com/webpack/webpack/issues/2117
    // Note: NoEmitOnErrorsPlugin replaced NoErrorsPlugin since webpack 2.x
    webpack.NoEmitOnErrorsPlugin
      ? new webpack.NoEmitOnErrorsPlugin()
      : new webpack.NoErrorsPlugin()
  );

  if (hot && !shouldExport) {
    if (!alreadyHasHmrPlugin(userWebpackConfig)) {
      plugins.push(new webpack.HotModuleReplacementPlugin());
    }
  }

  return (0, _extends4.default)({}, userWebpackConfig, {
    entry: entry,
    output: output,
    module: (0, _extends4.default)(
      {},
      (0, _lodash2.default)(userWebpackConfig.module, 'rules', 'loaders'),
      (0, _defineProperty3.default)({}, webpackRulesOptionName, rules)
    ),
    plugins: plugins
  });
}

function alreadyHasHmrPlugin(_ref2) {
  var plugins = _ref2.plugins;

  return (
    plugins &&
    plugins.filter(function(p) {
      return (
        p.constructor && p.constructor.name === 'HotModuleReplacementPlugin'
      );
    }).length > 0
  );
}

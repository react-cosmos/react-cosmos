'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = getDefaultWebpackConfig;

var _resolveFrom = require('resolve-from');

var _importFrom = require('import-from');

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos adds an entry & output when extending this.
function getDefaultWebpackConfig(rootPath) {
  // react-cosmos doesn't directly depend on any webpack loader.
  // Instead, it leverages the ones already installed by the user.
  var babelLoaderPath = (0, _resolveFrom.silent)(rootPath, 'babel-loader');
  var styleLoaderPath = (0, _resolveFrom.silent)(rootPath, 'style-loader');
  var cssLoaderPath = (0, _resolveFrom.silent)(rootPath, 'css-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  var jsonLoaderPath = (0, _resolveFrom.silent)(rootPath, 'json-loader');
  var loaders = [];

  if (babelLoaderPath) {
    loaders.push({
      test: /\.jsx?$/,
      loader: babelLoaderPath,
      exclude: /node_modules/
    });
  }

  if (styleLoaderPath) {
    loaders.push({
      test: /\.css$/,
      loader: cssLoaderPath
        ? styleLoaderPath + '!' + cssLoaderPath
        : styleLoaderPath,
      exclude: /node_modules/
    });
  }

  if (jsonLoaderPath) {
    loaders.push({
      test: /\.json$/,
      loader: jsonLoaderPath,
      exclude: /node_modules/
    });
  }

  var HtmlWebpackPlugin = (0, _importFrom.silent)(
    rootPath,
    'html-webpack-plugin'
  );
  var plugins = [];

  if (HtmlWebpackPlugin) {
    plugins.push(new HtmlWebpackPlugin({ title: 'React Cosmos' }));
  }

  return {
    // Besides other advantages, cheap-module-source-map is compatible with
    // React.componentDidCatch https://github.com/facebook/react/issues/10441
    devtool: 'cheap-module-source-map',
    resolve: {
      // Warning: webpack 1.x expects ['', '.js', '.jsx']
      extensions: ['.js', '.jsx']
    },
    module: {
      // Using loaders instead of rules to preserve webpack 1.x compatibility
      loaders: loaders
    },
    plugins: plugins
  };
}

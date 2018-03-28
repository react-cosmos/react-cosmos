import { silent as silentResolve } from 'resolve-from';
import { silent as silentImport } from 'import-from';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos adds an entry & output when extending this.
export default function getDefaultWebpackConfig(rootPath) {
  // react-cosmos doesn't directly depend on any webpack loader.
  // Instead, it leverages the ones already installed by the user.
  const babelLoaderPath = silentResolve(rootPath, 'babel-loader');
  const styleLoaderPath = silentResolve(rootPath, 'style-loader');
  const cssLoaderPath = silentResolve(rootPath, 'css-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  const jsonLoaderPath = silentResolve(rootPath, 'json-loader');
  const rules = [];

  if (babelLoaderPath) {
    rules.push({
      test: /\.jsx?$/,
      loader: babelLoaderPath,
      exclude: /node_modules/
    });
  }

  if (styleLoaderPath) {
    rules.push({
      test: /\.css$/,
      loader: cssLoaderPath
        ? `${styleLoaderPath}!${cssLoaderPath}`
        : styleLoaderPath,
      exclude: /node_modules/
    });

    // Preprocess 3rd party .css files located in node_modules
    rules.push({
      test: /\.css$/,
      loader: cssLoaderPath
        ? `${styleLoaderPath}!${cssLoaderPath}`
        : styleLoaderPath,
      include: /node_modules/
    });
  }

  if (jsonLoaderPath) {
    rules.push({
      test: /\.json$/,
      loader: jsonLoaderPath,
      exclude: /node_modules/
    });
  }

  const HtmlWebpackPlugin = silentImport(rootPath, 'html-webpack-plugin');
  const plugins = [];

  if (HtmlWebpackPlugin) {
    plugins.push(new HtmlWebpackPlugin({ title: 'React Cosmos' }));
  }

  let config = {
    // Besides other advantages, cheap-module-source-map is compatible with
    // React.componentDidCatch https://github.com/facebook/react/issues/10441
    devtool: 'cheap-module-source-map',
    resolve: {
      // Warning: webpack 1.x expects ['', '.js', '.jsx']
      extensions: ['.js', '.jsx']
    },
    module: {
      // Note: `module.rules` only works with webpack >=2.x. For 1.x
      // compatibility a custom webpack config (with module.loaders) is required
      rules
    },
    plugins
  };

  // Add mode option for webpack 4+
  const webpack = silentImport(rootPath, 'webpack');

  if (webpack.version && parseInt(webpack.version, 10) >= 4) {
    const mode = process.env.NODE_ENV || 'development';
    config = { ...config, mode };
  }

  return config;
}

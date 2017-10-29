import { silent as silentResolve } from 'resolve-from';
import { silent as silentImport } from 'import-from';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.
export default function getDefaultWebpackConfig(rootPath) {
  // react-cosmos-webpack doesn't directly depend on any webpack loader.
  // Instead, it leverages the ones already installed by the user.
  const babelLoaderPath = silentResolve(rootPath, 'babel-loader');
  const styleLoaderPath = silentResolve(rootPath, 'style-loader');
  const cssLoaderPath = silentResolve(rootPath, 'css-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  const jsonLoaderPath = silentResolve(rootPath, 'json-loader');
  const loaders = [];

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
        ? `${styleLoaderPath}!${cssLoaderPath}`
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

  const HtmlWebpackPlugin = silentImport(rootPath, 'html-webpack-plugin');
  const plugins = [];

  if (HtmlWebpackPlugin) {
    plugins.push(new HtmlWebpackPlugin({ title: 'React Cosmos' }));
  }

  return {
    devtool: 'eval',
    resolve: {
      // Warning: webpack 1.x expects ['', '.js', '.jsx']
      extensions: ['.js', '.jsx']
    },
    module: {
      // Using loaders instead of rules to preserve webpack 1.x compatibility
      loaders
    },
    plugins
  };
}

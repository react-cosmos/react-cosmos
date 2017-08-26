import HtmlWebpackPlugin from 'html-webpack-plugin';
import { silent } from 'resolve-from';

// This config doesn't have entry and output set up because it's not meant to
// work standalone. react-cosmos-webpack adds an entry & output when extending this.
export default function getDefaultWebpackConfig(cosmosConfigPath) {
  // react-cosmos-webpack doesn't directly depend on any webpack loader.
  // Instead, it leverages the ones already installed by the user.
  const babelLoader = silent(cosmosConfigPath, 'babel-loader');
  const styleLoader = silent(cosmosConfigPath, 'style-loader');
  const cssLoader = silent(cosmosConfigPath, 'css-loader');
  // Note: Since webpack >= v2.0.0, importing of JSON files will work by default
  const jsonLoader = silent(cosmosConfigPath, 'json-loader');

  const loaders = [];

  if (babelLoader) {
    loaders.push({
      test: /\.jsx?$/,
      loader: babelLoader,
      exclude: /node_modules/
    });
  }

  if (styleLoader) {
    loaders.push({
      test: /\.css$/,
      loader: cssLoader ? `${styleLoader}!${cssLoader}` : styleLoader,
      exclude: /node_modules/
    });
  }

  if (jsonLoader) {
    loaders.push({
      test: /\.json$/,
      loader: jsonLoader,
      exclude: /node_modules/
    });
  }

  return {
    devtool: 'eval',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      // Using loaders instead of rules to preserve webpack 1.x compatibility
      loaders
    },
    plugins: [
      // TODO: Use user's copy of HtmlWebpackPlugin
      new HtmlWebpackPlugin({
        title: 'React Cosmos'
      })
    ]
  };
}

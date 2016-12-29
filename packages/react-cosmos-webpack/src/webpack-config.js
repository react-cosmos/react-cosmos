/* eslint-disable global-require */

import importModule from 'react-cosmos-utils/lib/import-module';
import webpack from 'webpack';
import getConfig from './config';
import resolveUserPath from './utils/resolve-user-path';

/**
 * Extend the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the config path to make user configs available on the client-side
 */
export default function getWebpackConfig(
  userWebpackConfig,
  cosmosConfigPath
) {
  const cosmosConfig = getConfig(importModule(require(cosmosConfigPath)));

  const {
    componentPaths,
    fixturePaths,
    globalImports,
    hmrPlugin,
    hot,
  } = cosmosConfig;

  const resolvedComponentPaths = componentPaths.map(path =>
    resolveUserPath(path, cosmosConfigPath));
  const resolvedFixturePaths = fixturePaths.map(path =>
    resolveUserPath(path, cosmosConfigPath));
  const resolvedGlobalImports = globalImports.map(path =>
    resolveUserPath(path, cosmosConfigPath));

  const entry = [...resolvedGlobalImports];

  if (hot) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(require.resolve('webpack-hot-middleware/client'));
  }

  entry.push(`${require.resolve('./entry-loader')}?${JSON.stringify({
    componentPaths: resolvedComponentPaths,
    fixturePaths: resolvedFixturePaths,
  })}!${require.resolve('./entry')}`);

  const output = {
    // Webpack doesn't write to this path when saving build in memory, but
    // webpack-dev-middleware seems to crash without it
    path: '/',
    // Also not a real file. HtmlWebpackPlugin uses this path for the script
    // tag it injects.
    filename: 'bundle.js',
    publicPath: '/loader/',
  };

  const plugins = userWebpackConfig.plugins ? [...userWebpackConfig.plugins] : [];

  plugins.push(new webpack.DefinePlugin({
    COSMOS_CONFIG_PATH: JSON.stringify(cosmosConfigPath),
  }));

  if (hmrPlugin) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    ...userWebpackConfig,
    entry,
    output,
    plugins,
  };
}

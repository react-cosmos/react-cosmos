import webpack from 'webpack';
import getConfig from './config';
import resolveUserPath from './utils/resolve-user-path';
import importModule from 'react-cosmos-utils/lib/import-module';

/**
 * Extend the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the config path to make user configs available on the client-side
 */
export default function getWebpackConfig(
  userWebpackConfig,
  cosmosConfigPath,
) {
  const cosmosConfig = getConfig(importModule(require(cosmosConfigPath)));

  const {
    globalImports,
    hmrPlugin,
    hot,
  } = cosmosConfig;

  const resolvedGlobalImports = globalImports.map(path =>
    resolveUserPath(path, cosmosConfigPath));

  const entry = [...resolvedGlobalImports];

  if (hot) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(`${require.resolve('webpack-hot-middleware/client')}?reload=true`);
  }

  entry.push(require.resolve('./entry'));

  const output = {
    // Webpack doesn't write to this path when saving build in memory, but
    // webpack-dev-middleware seems to crash without it
    path: '/',
    // Also not a real file. HtmlWebpackPlugin uses this path for the script
    // tag it injects.
    filename: 'bundle.js',
    publicPath: '/loader/',
  };

  if (userWebpackConfig.module && userWebpackConfig.module.rules) {
    throw new Error('Please use `loaders` instead of `rules` in your webpack config');
  }

  const loaders = userWebpackConfig.module && userWebpackConfig.module.loaders ?
    [...userWebpackConfig.module.loaders] : [];
  const plugins = userWebpackConfig.plugins ? [...userWebpackConfig.plugins] : [];

  loaders.push({
    loader: require.resolve('./module-loader'),
    include: require.resolve('./user-modules'),
    query: {
      cosmosConfigPath,
    },
  });

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
    module: {
      ...userWebpackConfig.module,
      loaders,
    },
    plugins,
  };
}

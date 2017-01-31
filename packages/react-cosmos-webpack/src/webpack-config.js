import webpack from 'webpack';
import omit from 'lodash.omit';
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

  // To support webpack 1 and 2 configuration formats. So we use the one that user passes
  const webpackRulesOptionName = userWebpackConfig.module && userWebpackConfig.module.rules ? 'rules' : 'loaders';
  const rules = userWebpackConfig.module && userWebpackConfig.module[webpackRulesOptionName] ?
    [...userWebpackConfig.module[webpackRulesOptionName]] : [];
  const plugins = userWebpackConfig.plugins ? [...userWebpackConfig.plugins] : [];

  rules.push({
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
      ...omit(userWebpackConfig.module, 'rules', 'loaders'),
      [webpackRulesOptionName]: rules,
    },
    plugins,
  };
}

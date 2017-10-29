// @flow

import omit from 'lodash.omit';
import getCosmosConfig from 'react-cosmos-config';

import type { Config } from 'react-cosmos-config/src';

/**
 * Extend the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the config path to make user configs available on the client-side
 */
type Args = {
  webpack: Object,
  userWebpackConfig: Object,
  shouldExport?: boolean
};

export default function extendWebpackConfig({
  webpack,
  userWebpackConfig,
  shouldExport = false
}: Args) {
  const cosmosConfig: Config = getCosmosConfig();

  const {
    containerQuerySelector,
    globalImports,
    hot,
    outputPath
  } = cosmosConfig;

  const entry = [...globalImports];

  if (hot && !shouldExport) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(
      `${require.resolve('webpack-hot-middleware/client')}?reload=true`
    );
  }

  entry.push(require.resolve('../client/loader-entry'));

  const output = {
    path: shouldExport ? `${outputPath}/loader/` : '/loader/',
    filename: '[name].js',
    publicPath: shouldExport ? './' : '/loader/'
  };

  // To support webpack 1 and 2 configuration formats. So we use the one that user passes
  const webpackRulesOptionName =
    userWebpackConfig.module && userWebpackConfig.module.rules
      ? 'rules'
      : 'loaders';
  const rules =
    userWebpackConfig.module && userWebpackConfig.module[webpackRulesOptionName]
      ? [...userWebpackConfig.module[webpackRulesOptionName]]
      : [];
  const plugins = userWebpackConfig.plugins
    ? [...userWebpackConfig.plugins]
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
        containerQuerySelector
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

  return {
    ...userWebpackConfig,
    entry,
    output,
    module: {
      ...omit(userWebpackConfig.module, 'rules', 'loaders'),
      [webpackRulesOptionName]: rules
    },
    plugins
  };
}

function alreadyHasHmrPlugin({ plugins }) {
  return (
    plugins &&
    plugins.filter(
      p => p.constructor && p.constructor.name === 'HotModuleReplacementPlugin'
    ).length > 0
  );
}

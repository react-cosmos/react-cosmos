import webpack from 'webpack';
import omit from 'lodash.omit';
import getCosmosConfig from 'react-cosmos-config';

/**
 * Extend the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the config path to make user configs available on the client-side
 */
export default function getLoaderWebpackConfig(
  userWebpackConfig,
  cosmosConfigPath,
  shouldExport = false
) {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);

  const {
    containerQuerySelector,
    globalImports,
    hmrPlugin,
    hot,
    outputPath
  } = cosmosConfig;

  const entry = [...globalImports];

  if (hot && !shouldExport) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(`${require.resolve('webpack-hot-middleware/client')}?reload=true`);
  }

  entry.push(require.resolve('./loader-entry'));

  const output = {
    path: shouldExport ? `${outputPath}/loader/` : '/loader/',
    filename: 'bundle.js',
    publicPath: shouldExport ? './' : '/loader/',
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
    'process.env': {
      NODE_ENV: JSON.stringify(shouldExport ? 'production' : 'development')
    }
  }));

  plugins.push(new webpack.DefinePlugin({
    COSMOS_CONFIG: JSON.stringify({
      // Config options that are available inside the client bundle. Warning:
      // Must be serializable!
      containerQuerySelector,
    }),
  }));

  if (hmrPlugin && !shouldExport) {
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

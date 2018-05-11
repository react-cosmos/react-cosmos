// @flow

import path from 'path';
import omit from 'lodash.omit';
import { getCosmosConfig } from 'react-cosmos-config';
import { getEnv } from './get-env';

import type { Config } from 'react-cosmos-flow/config';

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
  const {
    containerQuerySelector,
    globalImports,
    hot,
    outputPath,
    webpack: webpackOverride
  }: Config = getCosmosConfig();

  let webpackConfig = userWebpackConfig;

  if (typeof webpackOverride === 'function') {
    console.log(`[Cosmos] Overriding webpack config`);
    webpackConfig = webpackOverride(webpackConfig, { env: getEnv() });
  }

  const entry = [...globalImports];

  if (hot && !shouldExport) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(
      `${require.resolve(
        'webpack-hot-middleware/client'
      )}?reload=true&overlay=false`
    );
  }

  entry.push(require.resolve('../client/loader-entry'));

  let output = {
    path: shouldExport ? `${outputPath}/loader/` : '/loader/',
    filename: '[name].js',
    publicPath: shouldExport ? './' : '/loader/'
  };

  // Exports are generally meant to run outside of the developer's machine
  if (!shouldExport) {
    // Enable click-to-open source
    output = {
      ...output,
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    };
  }

  const rules = [
    ...getExistingRules(webpackConfig),
    {
      loader: require.resolve('./embed-modules-webpack-loader'),
      include: require.resolve('../client/user-modules')
    }
  ];

  const plugins = [
    ...getExistingPlugins(webpackConfig),
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
    getNoErrorsPlugin(webpack)
  ];

  if (hot && !shouldExport) {
    if (!alreadyHasHmrPlugin(webpackConfig)) {
      plugins.push(new webpack.HotModuleReplacementPlugin());
    }
  }

  return {
    ...webpackConfig,
    entry,
    output,
    module: extendModuleWithRules(webpackConfig, rules),
    plugins
  };
}

function isPluginType(plugin, constructorName) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}

function alreadyHasHmrPlugin({ plugins }) {
  return (
    plugins &&
    plugins.filter(p => isPluginType(p, 'HotModuleReplacementPlugin')).length >
      0
  );
}

function getWebpackRulesOptionName(webpackConfig) {
  // To support webpack 1 and 2 configuration formats, we use the one that
  // user passes
  return webpackConfig.module && webpackConfig.module.rules
    ? 'rules'
    : 'loaders';
}

function getExistingRules(webpackConfig) {
  const webpackRulesOptionName = getWebpackRulesOptionName(webpackConfig);

  return webpackConfig.module && webpackConfig.module[webpackRulesOptionName]
    ? [...webpackConfig.module[webpackRulesOptionName]]
    : [];
}

function extendModuleWithRules(webpackConfig, rules) {
  const webpackRulesOptionName = getWebpackRulesOptionName(webpackConfig);

  return {
    ...omit(webpackConfig.module, 'rules', 'loaders'),
    [webpackRulesOptionName]: rules
  };
}

function getExistingPlugins(webpackConfig) {
  const plugins = webpackConfig.plugins ? [...webpackConfig.plugins] : [];

  return plugins.map(
    plugin =>
      isPluginType(plugin, 'HtmlWebpackPlugin')
        ? changeHtmlPluginFilename(plugin)
        : plugin
  );
}

function changeHtmlPluginFilename(htmlPlugin) {
  if (htmlPlugin.options.filename !== 'index.html') {
    return htmlPlugin;
  }

  return new htmlPlugin.constructor({
    ...htmlPlugin.options,
    filename: '_loader.html'
  });
}

function getNoErrorsPlugin(webpack) {
  // Important: Without this webpack tries to apply hot updates for broken
  // builds and results in duplicate React nodes attached
  // See https://github.com/webpack/webpack/issues/2117
  // Note: NoEmitOnErrorsPlugin replaced NoErrorsPlugin since webpack 2.x
  return webpack.NoEmitOnErrorsPlugin
    ? new webpack.NoEmitOnErrorsPlugin()
    : new webpack.NoErrorsPlugin();
}

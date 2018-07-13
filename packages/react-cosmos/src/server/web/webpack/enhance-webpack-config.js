// @flow

import { resolve, join } from 'path';
import { omit } from 'lodash';
import { getCosmosConfig } from 'react-cosmos-config';

import type { Config } from 'react-cosmos-flow/config';

/**
 * Enhance the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the user module require calls via embed-modules-webpack-loader
 * - Embed the playground options to use in the client-side bundle
 *
 * It's crucial for Cosmos to not depend on user-installed loaders. All
 * internal loaders and entries must have absolute path (via require.resolve)
 */
type Args = {
  webpack: Function,
  userWebpackConfig: Object,
  shouldExport?: boolean
};

export default function enhanceWebpackConfig({
  webpack,
  userWebpackConfig,
  shouldExport = false
}: Args) {
  const cosmosConfig: Config = getCosmosConfig();
  const {
    containerQuerySelector,
    hot,
    publicUrl,
    webpack: webpackOverride
  } = cosmosConfig;

  let webpackConfig = userWebpackConfig;

  if (typeof webpackOverride === 'function') {
    console.log(`[Cosmos] Overriding webpack config`);
    webpackConfig = webpackOverride(webpackConfig, { env: getEnv() });
  }

  const entry = getEntry(cosmosConfig, shouldExport);
  const output = getOutput(cosmosConfig, shouldExport);

  const rules = [
    ...getExistingRules(webpackConfig),
    {
      loader: require.resolve('./embed-modules-webpack-loader'),
      include: require.resolve('../../../client/user-modules')
    }
  ];

  const plugins = [
    ...getExistingPlugins(webpackConfig),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(shouldExport ? 'production' : 'development'),
        PUBLIC_URL: JSON.stringify(removeTrailingSlash(publicUrl))
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

function getEntry({ globalImports, hot }, shouldExport) {
  let entry = [...globalImports];

  if (hot && !shouldExport) {
    entry = [
      ...entry,
      `${require.resolve(
        'webpack-hot-middleware/client'
      )}?reload=true&overlay=false`
    ];
  }

  // Load loader entry last
  return [...entry, require.resolve('../../../client/loader-entry')];
}

function getOutput({ outputPath, publicUrl }, shouldExport) {
  const filename = '[name].js';

  if (shouldExport) {
    return {
      path: join(outputPath, publicUrl),
      filename,
      publicPath: publicUrl
    };
  }

  return {
    // Setting path to `/` in development (where files are saved in memory and
    // not on disk) is a weird required for old webpack versions
    path: '/',
    filename,
    publicPath: publicUrl,
    // Enable click-to-open source in react-error-overlay
    devtoolModuleFilenameTemplate: info =>
      resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  };
}

function getWebpackRulesOptionName(webpackConfig) {
  // To support webpack 1 and 2 configuration formats, we use the one that
  // user passes
  return webpackConfig.module && webpackConfig.module.loaders
    ? 'loaders'
    : 'rules';
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

function alreadyHasHmrPlugin({ plugins }) {
  return (
    plugins &&
    plugins.filter(p => isPluginType(p, 'HotModuleReplacementPlugin')).length >
      0
  );
}

function isPluginType(plugin, constructorName) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}

function removeTrailingSlash(str) {
  return str.replace(/\/$/, '');
}

function getEnv() {
  return process.env.NODE_ENV || 'development';
}

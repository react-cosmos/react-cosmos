import path from 'path';
import webpack from 'webpack';
import { RendererConfig } from '../../../shared';
import {
  CosmosConfig,
  getRootDir,
  getPublicUrl,
  getExportPath
} from '../../shared/config';
import { hasPlugin } from './shared';
import {
  getHtmlWebpackPlugin,
  isHtmlWebpackPlugin,
  changeHtmlPluginFilename
} from './htmlWebpackPlugin';

/**
 * Enhance the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the user module require calls via embedModulesWebpackLoader
 * - Embed the playground options to use in the client-side bundle
 *
 * It's crucial for Cosmos to not depend on user-installed loaders. All
 * internal loaders and entries must have absolute path (via require.resolve)
 */
type Args = {
  cosmosConfig: CosmosConfig;
  userWebpack: typeof webpack;
  userWebpackConfig: webpack.Configuration;
  staticBuild: boolean;
};

export function enhanceWebpackConfig({
  cosmosConfig,
  userWebpack,
  userWebpackConfig,
  staticBuild
}: Args): webpack.Configuration {
  const { hotReload, webpackOverride } = cosmosConfig;

  let webpackConfig = userWebpackConfig;
  if (typeof webpackOverride === 'function') {
    console.log(`[Cosmos] Overriding webpack config`);
    webpackConfig = webpackOverride(webpackConfig, { env: getEnv() });
  }

  const entry = getEntry(cosmosConfig, staticBuild);
  const output = getOutput(cosmosConfig, staticBuild);

  const rules = (webpackConfig.module && webpackConfig.module.rules) || [];
  rules.push({
    loader: require.resolve('./embedModulesWebpackLoader'),
    include: resolveClientPath('userModules')
  });

  const cleanPublicUrl = removeTrailingSlash(getPublicUrl(cosmosConfig));
  let plugins = [
    ...getExistingPlugins(webpackConfig),
    new userWebpack.DefinePlugin({
      // Having __DEV__ as boolean is useful because "if (__DEV__)" blocks can
      // get stripped automatically when compiling a static export build
      __DEV__: JSON.stringify(!staticBuild),
      'process.env': {
        NODE_ENV: JSON.stringify(staticBuild ? 'production' : 'development'),
        PUBLIC_URL: JSON.stringify(cleanPublicUrl)
      }
    }),
    new userWebpack.DefinePlugin({
      // Config options that are available inside the client bundle. Warning:
      // Must be serializable!
      RENDERER_CONFIG: JSON.stringify(getRendererConfig(cosmosConfig))
    }),
    new userWebpack.NoEmitOnErrorsPlugin()
  ];

  if (!hasPlugin(webpackConfig, 'HtmlWebpackPlugin')) {
    const htmlWebpackPlugin = getHtmlWebpackPlugin(getRootDir(cosmosConfig));
    if (htmlWebpackPlugin) {
      plugins = [
        ...plugins,
        new htmlWebpackPlugin({
          title: 'React Cosmos',
          filename: '_loader.html'
        })
      ];
    }
  }

  if (hotReload && !staticBuild) {
    if (!hasPlugin(webpackConfig, 'HotModuleReplacementPlugin')) {
      plugins = [...plugins, new userWebpack.HotModuleReplacementPlugin()];
    }
  }

  return {
    ...webpackConfig,
    entry,
    output,
    module: {
      ...webpackConfig.module,
      rules
    },
    plugins
  };
}

function getEntry({ hotReload }: CosmosConfig, staticBuild: boolean) {
  // The React devtools hook needs to be imported before any other module which
  // might import React
  const entry = [resolveClientPath('reactDevtoolsHook')];

  if (hotReload && !staticBuild) {
    entry.push(getHotMiddlewareEntry());
  }

  return [...entry, resolveClientPath('index')];
}

function resolveClientPath(relPath: string) {
  return require.resolve(`../../../client/${relPath}`);
}

function getHotMiddlewareEntry() {
  const clientPath = require.resolve('webpack-hot-middleware/client');
  return `${clientPath}?reload=true&overlay=false`;
}

function getOutput(cosmosConfig: CosmosConfig, staticBuild: boolean) {
  const publicUrl = getPublicUrl(cosmosConfig);
  const filename = '[name].js';

  if (staticBuild) {
    return {
      // Most paths are created using forward slashes regardless of the OS for
      // consistency, but this one needs to have backslashes on Windows!
      path: path.join(getExportPath(cosmosConfig), publicUrl),
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
    devtoolModuleFilenameTemplate: (info: { absoluteResourcePath: string }) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  };
}

function getExistingPlugins(webpackConfig: webpack.Configuration) {
  const plugins = webpackConfig.plugins ? [...webpackConfig.plugins] : [];
  return plugins.map(plugin =>
    isHtmlWebpackPlugin(plugin) ? changeHtmlPluginFilename(plugin) : plugin
  );
}

function getRendererConfig({
  containerQuerySelector
}: CosmosConfig): RendererConfig {
  return { containerQuerySelector };
}

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}

function getEnv() {
  return process.env.NODE_ENV || 'development';
}

import path from 'path';
import webpack from 'webpack';
import { CosmosConfig } from '../../../shared/config';
import { RENDERER_FILENAME } from '../../../shared/playgroundHtml';
import { hasPlugin } from './shared';
import {
  getHtmlWebpackPlugin,
  isHtmlWebpackPlugin,
  changeHtmlPluginFilename
} from './htmlPlugin';

/**
 * Enhance the user config to create the Renderer webpack config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the user config & modules via injectRendererDataLoader
 *
 * It's crucial for Cosmos to not depend on user-installed loaders. All
 * internal loaders and entries must have absolute path (via require.resolve)
 */
export function enhanceWebpackConfig({
  cosmosConfig,
  userWebpack,
  baseWebpackConfig,
  staticBuild
}: {
  cosmosConfig: CosmosConfig;
  userWebpack: typeof webpack;
  baseWebpackConfig: webpack.Configuration;
  staticBuild: boolean;
}): webpack.Configuration {
  // const { hotReload, webpackOverride } = cosmosConfig;

  const webpackConfig = baseWebpackConfig;
  // let newWebpackConfig = webpackConfig;
  // if (typeof webpackOverride === 'function') {
  //   console.log(`[Cosmos] Overriding webpack config`);
  //   webpackConfig = webpackOverride(webpackConfig, { env: getEnv() });
  // }

  const entry = getEntry(cosmosConfig, staticBuild);
  const output = getOutput(cosmosConfig, staticBuild);

  const rules = (webpackConfig.module && webpackConfig.module.rules) || [];
  rules.push({
    loader: require.resolve('./userDepsLoader'),
    include: resolveClientPath('index')
  });

  const cleanPublicUrl = removeTrailingSlash(cosmosConfig.publicUrl);
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
    new userWebpack.NoEmitOnErrorsPlugin()
  ];

  if (!hasPlugin(webpackConfig, 'HtmlWebpackPlugin')) {
    const htmlWebpackPlugin = getHtmlWebpackPlugin(cosmosConfig.rootDir);
    if (htmlWebpackPlugin) {
      plugins = [
        ...plugins,
        new htmlWebpackPlugin({
          title: 'React Cosmos',
          filename: RENDERER_FILENAME
        })
      ];
    }
  }

  // if (hotReload && !staticBuild) {
  //   if (!hasPlugin(webpackConfig, 'HotModuleReplacementPlugin')) {
  //     plugins = [...plugins, new userWebpack.HotModuleReplacementPlugin()];
  //   }
  // }

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

// function getEntry({ hotReload }: CosmosConfig, staticBuild: boolean) {
function getEntry(cosmosConfig: CosmosConfig, staticBuild: boolean) {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const entry = [resolveDomRendererPath('reactDevtoolsHook')];

  // if (hotReload && !staticBuild) {
  //   entry.push(getHotMiddlewareEntry());
  // }

  return [...entry, resolveClientPath('index')];
}

function resolveDomRendererPath(relPath: string) {
  return require.resolve(`../../../domRenderer/${relPath}`);
}

function resolveClientPath(relPath: string) {
  return require.resolve(`../client/${relPath}`);
}

// function getHotMiddlewareEntry() {
//   const clientPath = require.resolve('webpack-hot-middleware/client');
//   return `${clientPath}?reload=true&overlay=false`;
// }

function getOutput(cosmosConfig: CosmosConfig, staticBuild: boolean) {
  const filename = '[name].js';

  // if (staticBuild) {
  //   return {
  //     // Most paths are created using forward slashes regardless of the OS for
  //     // consistency, but this one needs to have backslashes on Windows!
  //     path: path.join(cosmosConfig.exportPath, publicUrl),
  //     filename,
  //     publicPath: publicUrl
  //   };
  // }

  return {
    // Setting path to `/` in development (where files are saved in memory and
    // not on disk) is a weird required for old webpack versions
    path: '/',
    filename,
    publicPath: cosmosConfig.publicUrl,
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

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}

// function getEnv() {
//   return process.env.NODE_ENV || 'development';
// }

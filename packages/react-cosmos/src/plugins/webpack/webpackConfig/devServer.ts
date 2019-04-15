import path from 'path';
import webpack from 'webpack';
import { WebpackCosmosConfig } from './../config';
import {
  getBaseWebpackConfig,
  resolveDomRendererPath,
  resolveClientPath,
  getUserDepsLoaderRule,
  getEnvVarPlugin
} from './shared';
import { ensureHtmlWebackPlugin } from './htmlPlugin';

export function getDevWebpackConfig(
  cosmosConfig: WebpackCosmosConfig,
  userWebpack: typeof webpack
) {
  const baseWebpackConfig = getBaseWebpackConfig(cosmosConfig, userWebpack);
  return {
    ...baseWebpackConfig,
    entry: getEntry(cosmosConfig),
    output: getOutput(cosmosConfig),
    module: {
      ...baseWebpackConfig.module,
      rules: getRules(baseWebpackConfig)
    },
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack)
  };
}

function getEntry(cosmosConfig: WebpackCosmosConfig) {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveDomRendererPath('reactDevtoolsHook');
  const clientIndex = resolveClientPath('index');

  // TODO: Bring back hotReload
  // return hotReload
  //   ? [devtoolsHook, getHotMiddlewareEntry(), clientIndex]
  //   : [devtoolsHook, clientIndex];
  return [devtoolsHook, clientIndex];
}

function getOutput({ publicUrl }: WebpackCosmosConfig) {
  const filename = '[name].js';
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

function getRules(baseWebpackConfig: webpack.Configuration) {
  const existingRules =
    (baseWebpackConfig.module && baseWebpackConfig.module.rules) || [];
  return [...existingRules, getUserDepsLoaderRule()];
}

function getPlugins(
  cosmosConfig: WebpackCosmosConfig,
  baseWebpackConfig: webpack.Configuration,
  userWebpack: typeof webpack
) {
  const existingPlugins = baseWebpackConfig.plugins || [];
  const envVarPlugin = getEnvVarPlugin(cosmosConfig, userWebpack, true);
  const noEmitErrorsPlugin = new userWebpack.NoEmitOnErrorsPlugin();
  const plugins = [...existingPlugins, envVarPlugin, noEmitErrorsPlugin];

  // TODO: Bring back hotReload
  // if (hotReload && !hasPlugin(plugins, 'HotModuleReplacementPlugin')) {
  //   const hmrPlugin = new userWebpack.HotModuleReplacementPlugin();
  //   plugins = [...plugins, hmrPlugin];
  // }

  return ensureHtmlWebackPlugin(cosmosConfig, plugins);
}

// function getHotMiddlewareEntry() {
//   const clientPath = require.resolve('webpack-hot-middleware/client');
//   return `${clientPath}?reload=true&overlay=false`;
// }

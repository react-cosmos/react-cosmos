import path from 'path';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { createWebpackCosmosConfig } from '../cosmosConfig/webpack';
import {
  getUserWebpackConfig,
  resolveDomRendererPath,
  resolveClientPath,
  getUserDepsLoaderRule,
  getEnvVarPlugin,
  hasPlugin
} from './shared';
import { ensureHtmlWebackPlugin } from './htmlPlugin';

export function getDevWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
): webpack.Configuration {
  const baseWebpackConfig = getUserWebpackConfig(cosmosConfig, userWebpack);
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

function getEntry(cosmosConfig: CosmosConfig) {
  const { hotReload } = createWebpackCosmosConfig(cosmosConfig);
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveDomRendererPath('reactDevtoolsHook');
  const clientIndex = resolveClientPath('index');

  return hotReload
    ? [devtoolsHook, getHotMiddlewareEntry(), clientIndex]
    : [devtoolsHook, clientIndex];
}

function getOutput({ publicUrl }: CosmosConfig) {
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
  cosmosConfig: CosmosConfig,
  baseWebpackConfig: webpack.Configuration,
  userWebpack: typeof webpack
) {
  const existingPlugins = baseWebpackConfig.plugins || [];
  const envVarPlugin = getEnvVarPlugin(cosmosConfig, userWebpack, true);
  const noEmitErrorsPlugin = new userWebpack.NoEmitOnErrorsPlugin();
  let plugins = [...existingPlugins, envVarPlugin, noEmitErrorsPlugin];

  const { hotReload } = createWebpackCosmosConfig(cosmosConfig);
  if (hotReload && !hasPlugin(plugins, 'HotModuleReplacementPlugin')) {
    const hmrPlugin = new userWebpack.HotModuleReplacementPlugin();
    plugins = [...plugins, hmrPlugin];
  }

  return ensureHtmlWebackPlugin(cosmosConfig, plugins);
}

function getHotMiddlewareEntry() {
  const clientPath = require.resolve('webpack-hot-middleware/client');
  return `${clientPath}?reload=true&overlay=false`;
}

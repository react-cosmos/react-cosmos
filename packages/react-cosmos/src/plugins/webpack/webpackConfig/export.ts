import path from 'path';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { ensureHtmlWebackPlugin } from './htmlPlugin';
import {
  getGlobalsPlugin,
  getUserDepsLoaderRule,
  getUserWebpackConfig,
  resolveClientPath,
  resolveLocalReactDeps
} from './shared';

export function getExportWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
): webpack.Configuration {
  const baseWebpackConfig = getUserWebpackConfig(cosmosConfig, userWebpack);
  return {
    ...baseWebpackConfig,
    entry: getEntry(),
    output: getOutput(cosmosConfig),
    module: {
      ...baseWebpackConfig.module,
      rules: getRules(baseWebpackConfig)
    },
    resolve: resolveLocalReactDeps(cosmosConfig, baseWebpackConfig),
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack)
  };
}

function getEntry() {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveClientPath('reactDevtoolsHook');
  const clientIndex = resolveClientPath('index');
  return [devtoolsHook, clientIndex];
}

function getOutput({ exportPath, publicUrl }: CosmosConfig) {
  const filename = '[name].js';
  return {
    // Remove leading slash to make a relative url, suitable for path.resolve
    path: path.resolve(exportPath, publicUrl.replace(/^\/+/, '')),
    filename,
    publicPath: publicUrl
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
  const globalsPlugin = getGlobalsPlugin(cosmosConfig, userWebpack, false);
  const noEmitErrorsPlugin = new userWebpack.NoEmitOnErrorsPlugin();

  return ensureHtmlWebackPlugin(cosmosConfig, [
    ...existingPlugins,
    globalsPlugin,
    noEmitErrorsPlugin
  ]);
}

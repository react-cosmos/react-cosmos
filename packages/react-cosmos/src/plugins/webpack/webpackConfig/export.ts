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

export function getExportWebpackConfig(
  cosmosConfig: WebpackCosmosConfig,
  userWebpack: typeof webpack
) {
  const baseWebpackConfig = getBaseWebpackConfig(cosmosConfig, userWebpack);
  return {
    ...baseWebpackConfig,
    entry: getEntry(),
    output: getOutput(cosmosConfig),
    module: {
      ...baseWebpackConfig.module,
      rules: getRules(baseWebpackConfig)
    },
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack)
  };
}

function getEntry() {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveDomRendererPath('reactDevtoolsHook');
  const clientIndex = resolveClientPath('index');
  return [devtoolsHook, clientIndex];
}

function getOutput({ exportPath, publicUrl }: WebpackCosmosConfig) {
  const filename = '[name].js';
  return {
    // Most paths are created using forward slashes regardless of the OS for
    // consistency, but this one needs to have backslashes on Windows!
    path: path.join(exportPath, publicUrl),
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
  cosmosConfig: WebpackCosmosConfig,
  baseWebpackConfig: webpack.Configuration,
  userWebpack: typeof webpack
) {
  const existingPlugins = baseWebpackConfig.plugins || [];
  const envVarPlugin = getEnvVarPlugin(cosmosConfig, userWebpack, false);
  const noEmitErrorsPlugin = new userWebpack.NoEmitOnErrorsPlugin();

  return ensureHtmlWebackPlugin(cosmosConfig, [
    ...existingPlugins,
    envVarPlugin,
    noEmitErrorsPlugin
  ]);
}

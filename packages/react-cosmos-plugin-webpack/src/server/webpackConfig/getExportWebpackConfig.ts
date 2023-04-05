import path from 'path';
import { removeLeadingSlash } from 'react-cosmos-core';
import { CosmosConfig } from 'react-cosmos/server.js';
import webpack from 'webpack';
import { createWebpackCosmosConfig } from '../cosmosConfig/createWebpackCosmosConfig.js';
import { getUserWebpackConfig } from './getUserWebpackConfig.js';
import { getWebpackConfigModule } from './getWebpackConfigModule.js';
import { getWebpackConfigResolve } from './getWebpackConfigResolve.js';
import { ensureHtmlWebackPlugin } from './htmlPlugin.js';
import { getGlobalsPlugin } from './plugins.js';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { ensureWebpackConfigTopLevelAwait } from './webpackConfigTopLevelAwait.js';

export async function getExportWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
): Promise<webpack.Configuration> {
  const baseWebpackConfig = await getUserWebpackConfig(
    cosmosConfig,
    userWebpack
  );
  return {
    ...baseWebpackConfig,
    entry: getEntry(),
    output: getOutput(cosmosConfig),
    module: getWebpackConfigModule(baseWebpackConfig),
    resolve: getWebpackConfigResolve(cosmosConfig, baseWebpackConfig),
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack),
    experiments: getExperiments(baseWebpackConfig),
  };
}

function getEntry() {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveWebpackClientPath('reactDevtoolsHook');
  const clientIndex = resolveWebpackClientPath('index');
  return [devtoolsHook, clientIndex];
}

function getOutput(cosmosConfig: CosmosConfig) {
  const { exportPath, publicUrl } = cosmosConfig;
  const { includeHashInOutputFilename } =
    createWebpackCosmosConfig(cosmosConfig);

  return {
    path: path.resolve(exportPath, removeLeadingSlash(publicUrl)),
    filename: includeHashInOutputFilename
      ? '[name].[contenthash].js'
      : '[name].js',
    publicPath: publicUrl,
  };
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
    noEmitErrorsPlugin,
  ]);
}

function getExperiments(baseWebpackConfig: webpack.Configuration) {
  return ensureWebpackConfigTopLevelAwait(baseWebpackConfig);
}

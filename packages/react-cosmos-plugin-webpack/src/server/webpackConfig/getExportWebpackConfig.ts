import path from 'path';
import { CosmosConfig } from 'react-cosmos';
import webpack from 'webpack';
import { createWebpackCosmosConfig } from '../cosmosConfig/createWebpackCosmosConfig.js';
import { getUserWebpackConfig } from './getUserWebpackConfig.js';
import { getWebpackConfigModule } from './getWebpackConfigModule.js';
import { getWebpackConfigResolve } from './getWebpackConfigResolve.js';
import { ensureHtmlWebackPlugin } from './htmlPlugin.js';
import { getGlobalsPlugin, ignoreEmptyWebpackPlugins } from './plugins.js';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';
import { ensureWebpackConfigTopLevelAwait } from './webpackConfigTopLevelAwait.js';

export async function getExportWebpackConfig(
  config: CosmosConfig,
  userWebpack: typeof webpack
): Promise<webpack.Configuration> {
  const baseWebpackConfig = await getUserWebpackConfig(config, userWebpack);
  return {
    ...baseWebpackConfig,
    entry: getEntry(),
    output: getOutput(config),
    module: getWebpackConfigModule(config, baseWebpackConfig, 'export'),
    resolve: getWebpackConfigResolve(config, baseWebpackConfig),
    plugins: getPlugins(config, baseWebpackConfig, userWebpack),
    experiments: getExperiments(baseWebpackConfig),
  };
}

function getEntry() {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveWebpackClientPath('reactDevtoolsHook.js');
  const clientIndex = resolveWebpackClientPath('index.js');
  return [devtoolsHook, clientIndex];
}

function getOutput(config: CosmosConfig) {
  const { exportPath, publicUrl } = config;
  const { includeHashInOutputFilename } = createWebpackCosmosConfig(config);

  return {
    path: path.join(exportPath, publicUrl),
    filename: includeHashInOutputFilename
      ? '[name].[contenthash].js'
      : '[name].js',
    publicPath: publicUrl,
  };
}

function getPlugins(
  config: CosmosConfig,
  baseWebpackConfig: webpack.Configuration,
  userWebpack: typeof webpack
) {
  const existingPlugins = ignoreEmptyWebpackPlugins(baseWebpackConfig.plugins);
  const globalsPlugin = getGlobalsPlugin(config, userWebpack, false);
  const noEmitErrorsPlugin = new userWebpack.NoEmitOnErrorsPlugin();

  return ensureHtmlWebackPlugin(config, [
    ...existingPlugins,
    globalsPlugin,
    noEmitErrorsPlugin,
  ]);
}

function getExperiments(baseWebpackConfig: webpack.Configuration) {
  return ensureWebpackConfigTopLevelAwait(baseWebpackConfig);
}

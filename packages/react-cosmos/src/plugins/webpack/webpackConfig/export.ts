import path from 'path';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { createWebpackCosmosConfig } from '../cosmosConfig/webpack';
import { removeLeadingSlash } from '../../../shared/shared';
import { ensureHtmlWebackPlugin } from './htmlPlugin';
import {
  getGlobalsPlugin,
  getUserDepsLoaderRule,
  getUserWebpackConfig,
  resolveClientPath,
  resolveLocalReactDeps,
} from './shared';

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
    module: {
      ...baseWebpackConfig.module,
      rules: getRules(baseWebpackConfig),
    },
    resolve: resolveLocalReactDeps(cosmosConfig, baseWebpackConfig),
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack),
  };
}

function getEntry() {
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveClientPath('reactDevtoolsHook');
  const clientIndex = resolveClientPath('index');
  return [devtoolsHook, clientIndex];
}

function getOutput(cosmosConfig: CosmosConfig) {
  const { exportPath, publicUrl } = cosmosConfig;
  const { includeHashInOutputFilename } = createWebpackCosmosConfig(cosmosConfig);

  return {
    path: path.resolve(exportPath, removeLeadingSlash(publicUrl)),
    filename: includeHashInOutputFilename ? '[name].[contenthash].js' : '[name].js',
    publicPath: publicUrl,
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
    noEmitErrorsPlugin,
  ]);
}

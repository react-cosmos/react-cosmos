import path from 'path';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config/shared';
import { removeLeadingSlash } from '../../../shared/utils';
import { createWebpackCosmosConfig } from '../cosmosConfig/createWebpackCosmosConfig';
import { getUserWebpackConfig } from './getUserWebpackConfig';
import { getWebpackConfigModule } from './getWebpackConfigModule';
import { getWebpackConfigResolve } from './getWebpackConfigResolve';
import { ensureHtmlWebackPlugin } from './htmlPlugin';
import { getGlobalsPlugin } from './plugins';
import { resolveWebpackClientPath } from './resolveWebpackClientPath';

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

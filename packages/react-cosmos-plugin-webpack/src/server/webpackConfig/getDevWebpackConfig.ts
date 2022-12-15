import path from 'path';
import { CosmosConfig, resolve } from 'react-cosmos/server.js';
import webpack from 'webpack';
import { createWebpackCosmosConfig } from '../cosmosConfig/createWebpackCosmosConfig.js';
import { getUserWebpackConfig } from './getUserWebpackConfig.js';
import { getWebpackConfigModule } from './getWebpackConfigModule.js';
import { getWebpackConfigResolve } from './getWebpackConfigResolve.js';
import { ensureHtmlWebackPlugin } from './htmlPlugin.js';
import { getGlobalsPlugin, hasPlugin } from './plugins.js';
import { resolveWebpackClientPath } from './resolveWebpackClientPath.js';

export async function getDevWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
): Promise<webpack.Configuration> {
  const baseWebpackConfig = await getUserWebpackConfig(
    cosmosConfig,
    userWebpack
  );

  const webpackConfig = {
    ...baseWebpackConfig,
    entry: getEntry(cosmosConfig),
    output: getOutput(cosmosConfig),
    module: getWebpackConfigModule(baseWebpackConfig),
    resolve: getWebpackConfigResolve(cosmosConfig, baseWebpackConfig),
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack),
  };

  // optimization.splitChunks.name = false breaks auto fixture file discovery.
  // When the splitChunks.name is set to false, existing fixtures hot reload
  // fine, but added or removed fixture files don't appear or disappear in the
  // React Cosmos UI automatically — a page refresh is required. The webpack
  // build updates correctly, but module.hot.accept isn't called on the client:
  // https://github.com/react-cosmos/react-cosmos/blob/548e9b7e9ca9fbc66f3915861cf1ae9d60222b28/packages/react-cosmos/src/plugins/webpack/client/index.ts#L24-L29
  // Create React App uses this setting:
  // https://github.com/facebook/create-react-app/blob/37712374bcaa6ccb168eeaf4fe8bd52d120dbc58/packages/react-scripts/config/webpack.config.js#L286
  // Apparently it's a webpack 4 bug:
  // https://twitter.com/wSokra/status/1255925851557974016
  if (webpackConfig.optimization?.splitChunks) {
    const { name } = webpackConfig.optimization.splitChunks;
    if (name === false) delete webpackConfig.optimization.splitChunks.name;
  }

  return webpackConfig;
}

function getEntry(cosmosConfig: CosmosConfig) {
  const { hotReload, reloadOnFail } = createWebpackCosmosConfig(cosmosConfig);
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveWebpackClientPath('reactDevtoolsHook');
  const clientIndex = resolveWebpackClientPath('index');

  return hotReload
    ? [devtoolsHook, getHotMiddlewareEntry(reloadOnFail), clientIndex]
    : [devtoolsHook, clientIndex];
}

function getOutput({ publicUrl }: CosmosConfig) {
  const filename = '[name].js';
  return {
    filename,
    publicPath: publicUrl,
    // Enable click-to-open source in react-error-overlay
    devtoolModuleFilenameTemplate: (info: { absoluteResourcePath: string }) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  };
}

function getPlugins(
  cosmosConfig: CosmosConfig,
  baseWebpackConfig: webpack.Configuration,
  userWebpack: typeof webpack
) {
  const existingPlugins = baseWebpackConfig.plugins || [];
  const globalsPlugin = getGlobalsPlugin(cosmosConfig, userWebpack, true);
  const noEmitErrorsPlugin = new userWebpack.NoEmitOnErrorsPlugin();
  let plugins = [...existingPlugins, globalsPlugin, noEmitErrorsPlugin];

  const { hotReload } = createWebpackCosmosConfig(cosmosConfig);
  if (hotReload && !hasPlugin(plugins, 'HotModuleReplacementPlugin')) {
    const hmrPlugin = new userWebpack.HotModuleReplacementPlugin();
    plugins = [...plugins, hmrPlugin];
  }

  return ensureHtmlWebackPlugin(cosmosConfig, plugins);
}

function getHotMiddlewareEntry(reloadOnFail: boolean) {
  const clientPath = resolve('webpack-hot-middleware/client');
  return `${clientPath}?reload=${reloadOnFail}&overlay=false`;
}

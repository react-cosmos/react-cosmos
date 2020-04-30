import path from 'path';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { createWebpackCosmosConfig } from '../cosmosConfig/webpack';
import { ensureHtmlWebackPlugin } from './htmlPlugin';
import {
  getGlobalsPlugin,
  getUserDepsLoaderRule,
  getUserWebpackConfig,
  hasPlugin,
  resolveClientPath,
  resolveLocalReactDeps,
} from './shared';

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
    module: {
      ...baseWebpackConfig.module,
      rules: getRules(baseWebpackConfig),
    },
    resolve: resolveLocalReactDeps(cosmosConfig, baseWebpackConfig),
    plugins: getPlugins(cosmosConfig, baseWebpackConfig, userWebpack),
  };

  // optimization.splitChunks.name = false partially breaks auto fixture file
  // discovery. Existing fixtures hot reload, but added/removed fixture files
  // wouldn't (dis)appear in the Cosmos UI without a page refresh. The webpack
  // build would update, but our module.hot.accept callback didn't get called:
  // https://github.com/react-cosmos/react-cosmos/blob/548e9b7e9ca9fbc66f3915861cf1ae9d60222b28/packages/react-cosmos/src/plugins/webpack/client/index.ts#L24-L29
  // I don't know _why_ this setting has this effect, but I discovered this bug
  // in Create React App, which uses this setting:
  // https://github.com/facebook/create-react-app/blob/37712374bcaa6ccb168eeaf4fe8bd52d120dbc58/packages/react-scripts/config/webpack.config.js#L286
  if (webpackConfig.optimization?.splitChunks) {
    const { name } = webpackConfig.optimization.splitChunks;
    if (name === false) delete webpackConfig.optimization.splitChunks.name;
  }

  return webpackConfig;
}

function getEntry(cosmosConfig: CosmosConfig) {
  const { hotReload } = createWebpackCosmosConfig(cosmosConfig);
  // The React devtools hook needs to be imported before any other module that
  // might import React
  const devtoolsHook = resolveClientPath('reactDevtoolsHook');
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
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
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

function getHotMiddlewareEntry() {
  const clientPath = require.resolve('@skidding/webpack-hot-middleware/client');
  return `${clientPath}?reload=true&overlay=false`;
}

import path from 'path';
import { argv } from 'yargs';
import webpack from 'webpack';
import { CosmosConfig } from '../../../config';
import { moduleExists, requireModule } from '../../../shared/fs';
import { createWebpackCosmosConfig } from '../cosmosConfig/webpack';
import { getDefaultWebpackConfig } from './default';
import { getDefaultExport } from './module';

type WebpackConfigExport =
  | webpack.Configuration
  // Mirror webpack API for config functions
  // https://webpack.js.org/configuration/configuration-types/#exporting-a-function
  | ((env: unknown, argv: {}) => webpack.Configuration);

// Override arguments are inspired by react-app-rewired
// https://github.com/timarney/react-app-rewired/blob/b673379d32fe7b57c71667f4827f3b16e3717363/scripts/start.js#L22
type WebpackOverride = (
  baseConfig: webpack.Configuration,
  env: string
) => webpack.Configuration;

export function getUserWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const baseWebpackConfig = getBaseWebpackConfig(cosmosConfig, userWebpack);
  const { overridePath } = createWebpackCosmosConfig(cosmosConfig);

  if (!overridePath || !moduleExists(overridePath)) {
    return baseWebpackConfig;
  }

  const relPath = path.relative(process.cwd(), overridePath);
  console.log(`[Cosmos] Overriding webpack config at ${relPath}`);
  const webpackOverride = getDefaultExport(
    requireModule(overridePath)
  ) as WebpackOverride;

  return webpackOverride(baseWebpackConfig, getNodeEnv());
}

export function getBaseWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const { rootDir } = cosmosConfig;
  const { configPath } = createWebpackCosmosConfig(cosmosConfig);

  if (!configPath || !moduleExists(configPath)) {
    console.log('[Cosmos] Using default webpack config');
    return getDefaultWebpackConfig(userWebpack, rootDir);
  }

  const relPath = path.relative(process.cwd(), configPath);
  console.log(`[Cosmos] Using webpack config found at ${relPath}`);

  const userConfigExport = getDefaultExport(
    requireModule(configPath)
  ) as WebpackConfigExport;
  return typeof userConfigExport === 'function'
    ? userConfigExport(argv.env, argv)
    : userConfigExport;
}

export function resolveDomRendererPath(relPath: string) {
  return require.resolve(`../../../domRenderer/${relPath}`);
}

export function resolveClientPath(relPath: string) {
  return require.resolve(`../client/${relPath}`);
}

export function getUserDepsLoaderRule() {
  return {
    loader: require.resolve('./userDepsLoader'),
    include: resolveClientPath('userDeps')
  };
}

export function getGlobalsPlugin(
  { publicUrl }: CosmosConfig,
  userWebpack: typeof webpack,
  devServerOn: boolean
) {
  const cleanPublicUrl = removeTrailingSlash(publicUrl);
  return new userWebpack.DefinePlugin({
    // "if (__DEV__)" blocks get stripped when compiling a static export build
    __DEV__: JSON.stringify(devServerOn),
    'process.env': {
      NODE_ENV: JSON.stringify(getNodeEnv()),
      PUBLIC_URL: JSON.stringify(cleanPublicUrl)
    }
  });
}

export function hasPlugin(
  plugins: void | webpack.Plugin[],
  pluginName: string
) {
  return (
    plugins && plugins.filter(p => isInstanceOfPlugin(p, pluginName)).length > 0
  );
}

export function isInstanceOfPlugin(
  plugin: webpack.Plugin,
  constructorName: string
) {
  return plugin.constructor && plugin.constructor.name === constructorName;
}

function removeTrailingSlash(url: string) {
  return url.replace(/\/$/, '');
}

function getNodeEnv() {
  return process.env.NODE_ENV || 'development';
}

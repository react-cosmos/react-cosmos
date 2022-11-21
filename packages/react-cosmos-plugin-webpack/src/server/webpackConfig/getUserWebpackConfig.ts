import path from 'path';
import {
  CosmosConfig,
  getCliArgs,
  moduleExists,
  importModule,
} from 'react-cosmos/server.js';
import webpack from 'webpack';
import { createWebpackCosmosConfig } from '../cosmosConfig/createWebpackCosmosConfig.js';
import { getDefaultWebpackConfig } from './getDefaultWebpackConfig.js';
import { getWebpackNodeEnv } from './getWebpackNodeEnv.js';

type WebpackConfigExport =
  | webpack.Configuration
  // Mirror webpack API for config functions
  // https://webpack.js.org/configuration/configuration-types/#exporting-a-function
  | ((
      env: unknown,
      _argv: {}
    ) => webpack.Configuration | Promise<webpack.Configuration>);

// Override arguments are inspired by react-app-rewired
// https://github.com/timarney/react-app-rewired/blob/b673379d32fe7b57c71667f4827f3b16e3717363/scripts/start.js#L22
type WebpackOverride = (
  baseConfig: webpack.Configuration,
  env: string
) => webpack.Configuration;

export async function getUserWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const baseWebpackConfig = await getBaseWebpackConfig(
    cosmosConfig,
    userWebpack
  );
  const { overridePath } = createWebpackCosmosConfig(cosmosConfig);

  if (!overridePath || !moduleExists(overridePath)) {
    return baseWebpackConfig;
  }

  const relPath = path.relative(process.cwd(), overridePath);
  console.log(`[Cosmos] Overriding webpack config at ${relPath}`);
  const webpackOverride = getDefaultExport(
    await importModule<WebpackOverride>(overridePath)
  );

  return webpackOverride(baseWebpackConfig, getWebpackNodeEnv());
}

async function getBaseWebpackConfig(
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
    await importModule<WebpackConfigExport>(configPath)
  );
  const cliArgs = getCliArgs();
  return typeof userConfigExport === 'function'
    ? await userConfigExport(cliArgs.env || getWebpackNodeEnv(), cliArgs)
    : userConfigExport;
}

// Get "default" export from either an ES or CJS module
// More context: https://github.com/react-cosmos/react-cosmos/issues/895
function getDefaultExport<T extends object>(module: T | { default: T }): T {
  if (typeof module === 'object' && 'default' in module) {
    return module.default;
  }

  return module;
}

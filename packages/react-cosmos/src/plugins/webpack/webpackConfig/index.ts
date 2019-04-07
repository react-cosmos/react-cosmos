import path from 'path';
import { argv } from 'yargs';
// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';
import { CosmosConfig } from '../../../shared/config';
import { getDefaultWebpackConfig } from './default';
import { enhanceWebpackConfig } from './enhance';

export function getWebpackConfig({
  cosmosConfig,
  userWebpack,
  staticBuild
}: {
  cosmosConfig: CosmosConfig;
  userWebpack: typeof webpack;
  staticBuild: boolean;
}) {
  const baseWebpackConfig = getBaseWebpackConfig(cosmosConfig, userWebpack);
  return enhanceWebpackConfig({
    cosmosConfig,
    userWebpack,
    baseWebpackConfig,
    staticBuild
  });
}

function getBaseWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const { rootDir, webpackConfigPath } = cosmosConfig;
  if (!webpackConfigPath) {
    console.log('[Cosmos] Using default webpack config');
    return getDefaultWebpackConfig(userWebpack, rootDir);
  }

  // TODO: Ensure path is absolute
  if (!moduleExists(webpackConfigPath)) {
    throw new Error(`Invalid webpack config path: ${webpackConfigPath}`);
  }

  const relPath = path.relative(process.cwd(), webpackConfigPath);
  console.log(`[Cosmos] Using webpack config found at ${relPath}`);

  const userConfig = getDefaultExport(require(webpackConfigPath));
  return typeof userConfig === 'function'
    ? userConfig(process.env.NODE_ENV, argv)
    : userConfig;
}

// Better than fs.existsSync because it works for paths without an extension
export function moduleExists(modulePath: string) {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
}

// Get "default" export from either an ES or CJS module
// More context: https://github.com/react-cosmos/react-cosmos/issues/895
function getDefaultExport(module: { default?: {} }) {
  if (typeof module === 'object' && 'default' in module) {
    return module.default;
  }

  return module;
}

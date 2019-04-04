import path from 'path';
import { argv } from 'yargs';
import getDefaultWebpackConfig from './defaultWebpackConfig';
import { CosmosConfig, getRootDir } from '../../shared/config';
import { getDefaultExport, moduleExists } from '../../shared/module';
// TODO: Test if a webpack import (require) is kept in the compiled file
import webpack from 'webpack';

// TODO: Rename and group with other config modules
export function getUserWebpackConfig(
  cosmosConfig: CosmosConfig,
  userWebpack: typeof webpack
) {
  const { webpackConfigPath } = cosmosConfig;
  if (!webpackConfigPath) {
    console.log('[Cosmos] Using default webpack config');
    return getDefaultWebpackConfig(userWebpack, getRootDir(cosmosConfig));
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

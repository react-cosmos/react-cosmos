// @flow

import path from 'path';
import { argv } from 'yargs';
import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/server';
import getDefaultWebpackConfig from './default-webpack-config';

import type { Config } from 'react-cosmos-flow/config';

export function getUserWebpackConfig(cosmosConfig: Config) {
  const { rootPath, webpackConfigPath } = cosmosConfig;

  if (hasUserCustomWebpackConfig(cosmosConfig)) {
    const relPath = path.relative(process.cwd(), webpackConfigPath);
    console.log(`[Cosmos] Using webpack config found at ${relPath}`);

    let userConfig = importModule(require(webpackConfigPath));
    if (typeof userConfig === 'function') {
      userConfig = userConfig(process.env.NODE_ENV, argv);
    }

    return userConfig;
  }

  console.log('[Cosmos] No webpack config found, using defaults');
  return getDefaultWebpackConfig(rootPath);
}

export function hasUserCustomWebpackConfig(cosmosConfig: Config) {
  return moduleExists(cosmosConfig.webpackConfigPath);
}

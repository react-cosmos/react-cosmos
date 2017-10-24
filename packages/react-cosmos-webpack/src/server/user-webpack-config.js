// @flow

import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/lib/server';
import getDefaultWebpackConfig from './default-webpack-config';

import type { Config } from 'react-cosmos-config/src';

export default function getUserWebpackConfig(cosmosConfig: Config) {
  const { rootPath, webpackConfigPath } = cosmosConfig;

  if (moduleExists(webpackConfigPath)) {
    console.log(`[Cosmos] Using webpack config found at ${webpackConfigPath}`);
    return importModule(require(webpackConfigPath));
  }

  console.log('[Cosmos] No webpack config found, using defaults');
  return getDefaultWebpackConfig(rootPath);
}

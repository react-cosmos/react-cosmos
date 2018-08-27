// @flow

import { slash } from 'react-cosmos-shared/server';
import { silent as silentResolve } from 'resolve-from';
import { hasUserCustomWebpackConfig } from './webpack/user-webpack-config';

import type { Config } from 'react-cosmos-flow/config';
import type { PlaygroundWebOpts } from 'react-cosmos-flow/playground';

export function getPlaygroundOpts(cosmosConfig: Config): PlaygroundWebOpts {
  const { rootPath, publicUrl, plugin } = cosmosConfig;

  return {
    platform: 'web',
    projectKey: rootPath,
    loaderUri: slash(publicUrl, '_loader.html'),
    webpackConfigType: hasUserCustomWebpackConfig(cosmosConfig)
      ? 'custom'
      : 'default',
    deps: getDeps(cosmosConfig),
    plugin
  };
}

function getDeps({ rootPath }: Config) {
  // We use knowledge of installed dependencies, collected on the server side,
  // to guide user onboarding in the Cosmos UI
  return {
    'html-webpack-plugin': hasDep(rootPath, 'html-webpack-plugin')
  };
}

function hasDep(rootPath: string, depName: string): boolean {
  return Boolean(silentResolve(rootPath, depName));
}

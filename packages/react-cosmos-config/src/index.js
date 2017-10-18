// @flow

import path from 'path';
import { argv } from 'yargs';
import importModule from 'react-cosmos-utils/lib/import-module';
import moduleExists from 'react-cosmos-utils/lib/module-exists';
import resolveUserPath from 'react-cosmos-utils/lib/resolve-user-path';

type UserConfig = {
  globalImports: Array<string>,
  hostname: string,
  hot: boolean,
  port: number,
  proxiesPath: string,
  webpackConfigPath: string,
  outputPath: string,
  publicPath?: string,
  publicUrl: string,
  containerQuerySelector?: string,
  // Deprecated
  componentPaths: Array<string>,
  ignore: Array<RegExp>,
  fixturesDir: string,
  fixturePaths: Array<string>
};

export type Config = {
  rootPath: string
} & UserConfig;

const defaults = {
  globalImports: [],
  hostname: 'localhost',
  hot: true,
  port: 8989,
  proxiesPath: 'cosmos.proxies',
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export',
  publicUrl: '/loader/',
  // Deprecated
  componentPaths: [],
  ignore: [],
  fixturesDir: '__fixtures__',
  fixturePaths: []
};

export default function getCosmosConfig(): Config {
  const cosmosConfigPath = resolveUserPath(
    process.cwd(),
    argv.config || 'cosmos.config'
  );

  if (!moduleExists(cosmosConfigPath)) {
    if (argv.config) {
      const cosmosConfigPathRel = path.relative(
        process.cwd(),
        cosmosConfigPath
      );
      console.warn(
        `[Cosmos] Using defaults, no config file found at ${cosmosConfigPathRel}!`
      );
    } else {
      console.log(`[Cosmos] Using defaults, no config file found`);
    }

    return {
      rootPath: process.cwd(),
      ...getNormalizedConfig(defaults, process.cwd())
    };
  }

  const userConfig = importModule(require(cosmosConfigPath));
  const rootPath = path.dirname(cosmosConfigPath);
  const config = {
    ...defaults,
    ...userConfig
  };

  return {
    rootPath,
    ...getNormalizedConfig(config, rootPath)
  };
}

function getNormalizedConfig(
  rawConfig: UserConfig,
  rootPath: string
): UserConfig {
  const {
    globalImports,
    outputPath,
    proxiesPath,
    webpackConfigPath,
    // Deprecated
    componentPaths,
    fixturePaths
  } = rawConfig;

  return {
    ...rawConfig,
    globalImports: globalImports.map(p => resolveUserPath(rootPath, p)),
    outputPath: resolveUserPath(rootPath, outputPath),
    proxiesPath: resolveUserPath(rootPath, proxiesPath),
    webpackConfigPath: resolveUserPath(rootPath, webpackConfigPath),
    // Deprecated
    componentPaths: componentPaths.map(p => resolveUserPath(rootPath, p)),
    fixturePaths: fixturePaths.map(p => resolveUserPath(rootPath, p))
  };
}

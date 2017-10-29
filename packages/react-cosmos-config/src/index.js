// @flow

import path from 'path';
import { argv } from 'yargs';
import { importModule } from 'react-cosmos-shared';
import { moduleExists, resolveUserPath } from 'react-cosmos-shared/lib/server';
import { log, warn } from './log';

import type { ExcludePatterns } from 'react-cosmos-shared/src/types';

export type Config = {
  rootPath: string,
  fileMatch?: Array<string>,
  exclude?: ExcludePatterns,
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

const defaults = {
  rootPath: '.',
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

export default function getCosmosConfig(cosmosConfigPath?: string): Config {
  const configPath =
    cosmosConfigPath ||
    resolveUserPath(process.cwd(), argv.config || 'cosmos.config');
  const relPath = path.dirname(configPath);

  if (!moduleExists(configPath)) {
    if (argv.config) {
      const relPath = path.relative(process.cwd(), configPath);
      warn(`[Cosmos] No config file found at ${relPath}, using defaults`);
    } else {
      log(`[Cosmos] No config file found, using defaults`);
    }

    return getNormalizedConfig(defaults, relPath);
  }

  const userConfig = importModule(require(configPath));
  const config = {
    ...defaults,
    ...userConfig
  };

  return getNormalizedConfig(config, relPath);
}

function getNormalizedConfig(relativeConfig: Config, relPath: string): Config {
  const {
    globalImports,
    outputPath,
    proxiesPath,
    publicPath,
    webpackConfigPath,
    // Deprecated
    componentPaths,
    fixturePaths
  } = relativeConfig;

  const rootPath = path.resolve(relPath, relativeConfig.rootPath);
  const config = {
    ...relativeConfig,
    rootPath,
    globalImports: globalImports.map(p => resolveUserPath(rootPath, p)),
    outputPath: path.resolve(rootPath, outputPath),
    proxiesPath: resolveUserPath(rootPath, proxiesPath),
    webpackConfigPath: resolveUserPath(rootPath, webpackConfigPath),
    // Deprecated
    componentPaths: componentPaths.map(p => path.resolve(rootPath, p)),
    fixturePaths: fixturePaths.map(p => path.resolve(rootPath, p))
  };

  if (publicPath) {
    config.publicPath = path.resolve(rootPath, publicPath);
  }

  return config;
}

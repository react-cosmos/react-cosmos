// @flow

import fs from 'fs';
import path from 'path';
import { argv } from 'yargs';
import { importModule } from 'react-cosmos-shared';
import {
  moduleExists,
  resolveUserPath,
  defaultFileMatch,
  defaultExclude
} from 'react-cosmos-shared/lib/server';
import { log, warn } from './log';
import { CRA_COSMOS_CONFIG } from './config-templates';

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
  responsiveDevices: Array<{| label: string, width: number, height: number |}>,
  httpProxy?: {| context: string, target: string |},
  // Deprecated
  componentPaths: Array<string>,
  ignore: Array<RegExp>,
  fixturesDir: string,
  fixturePaths: Array<string>
};

const defaults = {
  rootPath: '.',
  fileMatch: defaultFileMatch,
  exclude: defaultExclude,
  globalImports: [],
  hostname: 'localhost',
  hot: true,
  port: 8989,
  proxiesPath: 'cosmos.proxies',
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export',
  publicUrl: '/loader/',
  responsiveDevices: [
    { label: 'iPhone 5', width: 320, height: 568 },
    { label: 'iPhone 6', width: 375, height: 667 },
    { label: 'iPhone 6 Plus', width: 414, height: 736 },
    { label: 'Medium', width: 1024, height: 768 },
    { label: 'Large', width: 1440, height: 900 },
    { label: '1080p', width: 1920, height: 1080 }
  ],
  // Deprecated
  componentPaths: [],
  ignore: [],
  fixturesDir: '__fixtures__',
  fixturePaths: []
};

export function getCosmosConfig(cosmosConfigPath?: string): Config {
  const configPath = getUserConfigPath(cosmosConfigPath);
  const relPath = path.dirname(configPath);

  if (!configExist(configPath)) {
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

export function hasUserCosmosConfig(): boolean {
  return configExist(getUserConfigPath());
}

export function generateCosmosConfig(): ?string {
  // Warning: This code assumes the user hasn't created cosmos.config by now
  const configPath = getUserConfigPath();
  const rootPath = path.dirname(configPath);
  const craWebpackConfigPath = 'react-scripts/config/webpack.config.dev';

  if (moduleExists(resolveUserPath(rootPath, craWebpackConfigPath))) {
    fs.writeFileSync(configPath, CRA_COSMOS_CONFIG, 'utf8');

    return 'Create React App';
  }
}

function getUserConfigPath(customConfigPath?: string) {
  const loosePath = path.resolve(
    process.cwd(),
    customConfigPath || argv.config || 'cosmos.config.js'
  );

  // Ensure path has file extension
  return loosePath.match(/\.js$/) ? loosePath : `${loosePath}.js`;
}

function configExist(path: string): boolean {
  // Only resolve config path once we know it exists, otherwise the path will
  // be cached to a missing module for the rest of the process execution.
  // This allows us to generate the config at run time and import it later.
  return fs.existsSync(path);
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

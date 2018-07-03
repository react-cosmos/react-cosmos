// @flow

import fs from 'fs';
import path from 'path';
import { argv } from 'yargs';
import { importModule } from 'react-cosmos-shared';
import {
  moduleExists,
  resolveUserPath,
  defaultFileMatch,
  defaultFileMatchIgnore,
  defaultExclude
} from 'react-cosmos-shared/server';
import { log, warn } from './log';
import { CRA_COSMOS_CONFIG } from './config-templates';

import type { Config } from 'react-cosmos-flow/config';

const defaults = {
  rootPath: '.',
  fileMatch: defaultFileMatch,
  fileMatchIgnore: defaultFileMatchIgnore,
  exclude: defaultExclude,
  globalImports: [],
  // From Node.js docs: If host is omitted, the server will accept connections
  // on the unspecified IPv6 address (::) when IPv6 is available, or the
  // unspecified IPv4 address (0.0.0.0) otherwise.
  // This is particularly useful when running Cosmos inside a Docker container
  // https://github.com/react-cosmos/react-cosmos/issues/639
  hostname: null,
  hot: true,
  port: 8989,
  proxiesPath: 'cosmos.proxies',
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export',
  publicUrl: '/',
  watchDirs: ['.'],
  // Only used by the React Native server, modulesPath specifies where to
  // generate the file with imports to all user fixtures and proxies.
  // Whereas most of the other paths are used to import modules, modulesPath is
  // used as an output file path and it requires a file extension.
  modulesPath: 'cosmos.modules.js',
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
    watchDirs,
    modulesPath,
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
    watchDirs: watchDirs.map(p => path.resolve(rootPath, p)),
    modulesPath: resolveUserPath(rootPath, modulesPath),
    // Deprecated
    componentPaths: componentPaths.map(p => path.resolve(rootPath, p)),
    fixturePaths: fixturePaths.map(p => path.resolve(rootPath, p))
  };

  if (publicPath) {
    config.publicPath = path.resolve(rootPath, publicPath);
  }

  return config;
}

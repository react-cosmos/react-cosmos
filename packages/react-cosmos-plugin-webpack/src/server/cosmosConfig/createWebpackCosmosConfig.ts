import path from 'path';
import { CosmosConfig, fileExists } from 'react-cosmos';
import { resolveLoose } from '../utils/resolveLoose.js';

type WebpackCosmosConfig = {
  configPath: null | string;
  overridePath: null | string;
  includeHashInOutputFilename: boolean;
  hotReload: boolean;
  // Related to, but separate from, the 'hotReload' option.
  // Matches to the 'reload' config option in webpack-hot-middleware.
  // If false, location reload will *not* occur when webpack gets stuck updating code.
  reloadOnFail: boolean;
};

type WebpackCosmosConfigInput = Partial<WebpackCosmosConfig>;

export function createWebpackCosmosConfig(
  config: CosmosConfig
): WebpackCosmosConfig {
  const { rootDir } = config;
  const configInput: WebpackCosmosConfigInput = config.webpack || {};

  return {
    configPath: getWebpackConfigPath(configInput, rootDir),
    overridePath: getWebpackOverridePath(configInput, rootDir),
    includeHashInOutputFilename: getIncludeHashInOutputFilename(configInput),
    hotReload: getHotReload(configInput),
    reloadOnFail: getReloadOnFail(configInput),
  };
}

function getWebpackConfigPath(
  { configPath }: WebpackCosmosConfigInput,
  rootDir: string
) {
  if (typeof configPath === 'undefined') {
    return resolveLoose(rootDir, 'webpack.config.js');
  }

  // User can choose to prevent automatical use of an existing webpack.config.js
  // file (relative to the root dir) by setting configPath to null
  if (!configPath) {
    return null;
  }

  const absPath = resolveLoose(rootDir, configPath);
  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`Webpack config not found at path: ${relPath}`);
  }

  return absPath;
}

function getWebpackOverridePath(
  { overridePath }: WebpackCosmosConfigInput,
  rootDir: string
) {
  if (typeof overridePath === 'undefined') {
    return resolveLoose(rootDir, 'webpack.override.js');
  }

  // User can choose to prevent automatical use of an existing webpack.override.js
  // file (relative to the root dir) by setting overridePath to null
  if (!overridePath) {
    return null;
  }

  const absPath = resolveLoose(rootDir, overridePath);
  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`Webpack override module not found at path: ${relPath}`);
  }

  return absPath;
}

// Default value is False to not break backwards compatibility
// In future releases it's better to mark this as @deprecated and set
// output.filename to "[name].[contenthash].js" by default
function getIncludeHashInOutputFilename({
  includeHashInOutputFilename = false,
}: WebpackCosmosConfigInput) {
  return includeHashInOutputFilename;
}

function getHotReload({ hotReload = true }: WebpackCosmosConfigInput) {
  return hotReload;
}

function getReloadOnFail({ reloadOnFail = false }: WebpackCosmosConfigInput) {
  return reloadOnFail;
}

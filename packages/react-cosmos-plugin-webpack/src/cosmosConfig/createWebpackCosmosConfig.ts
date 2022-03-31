import path from 'path';
import { resolveModule } from 'react-cosmos/src/server/cosmosConfig/resolveModule';
import { CosmosConfig } from 'react-cosmos/src/server/cosmosConfig/types';
import { fileExists } from 'react-cosmos/src/server/fs';

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
  cosmosConfig: CosmosConfig
): WebpackCosmosConfig {
  const { rootDir } = cosmosConfig;
  const configInput = (cosmosConfig.webpack || {}) as WebpackCosmosConfigInput;

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
    return resolveModule(rootDir, 'webpack.config.js');
  }

  // User can choose to prevent automatical use of an existing webpack.config.js
  // file (relative to the root dir) by setting configPath to null
  if (!configPath) {
    return null;
  }

  const absPath = resolveModule(rootDir, configPath);
  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`webpack config not found at path: ${relPath}`);
  }

  return absPath;
}

function getWebpackOverridePath(
  { overridePath }: WebpackCosmosConfigInput,
  rootDir: string
) {
  if (typeof overridePath === 'undefined') {
    return resolveModule(rootDir, 'webpack.override.js');
  }

  // User can choose to prevent automatical use of an existing webpack.override.js
  // file (relative to the root dir) by setting overridePath to null
  if (!overridePath) {
    return null;
  }

  const absPath = resolveModule(rootDir, overridePath);
  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`webpack override module not found at path: ${relPath}`);
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

function getReloadOnFail({ reloadOnFail = true }: WebpackCosmosConfigInput) {
  return reloadOnFail;
}

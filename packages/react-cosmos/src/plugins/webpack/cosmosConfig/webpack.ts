import path from 'path';
import { CosmosConfig, resolveModule } from '../../../config';
import { fileExists } from '../../../shared/fs';

type WebpackCosmosConfig = {
  configPath: null | string;
  overridePath: null | string;
  hotReload: boolean;
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
    hotReload: getHotReload(configInput)
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

function getHotReload({ hotReload = true }: WebpackCosmosConfigInput) {
  return hotReload;
}

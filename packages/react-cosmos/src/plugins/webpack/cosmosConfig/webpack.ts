import path from 'path';
import { CosmosConfig, resolvePath } from '../../../config';
import { fileExists } from '../../../shared/fs';

type WebpackCosmosConfig = {
  configPath: null | string;
  hotReload: boolean;
};

type WebpackCosmosConfigInput = Partial<WebpackCosmosConfig>;

export function createWebpackCosmosConfig(
  cosmosConfig: CosmosConfig
): WebpackCosmosConfig {
  const { rootDir } = cosmosConfig;
  const webpackCosmosConfigInput = (cosmosConfig.webpack ||
    {}) as WebpackCosmosConfigInput;
  return {
    configPath: getWebpackConfigPath(webpackCosmosConfigInput, rootDir),
    hotReload: getHotReload(webpackCosmosConfigInput)
  };
}

function getWebpackConfigPath(
  { configPath }: WebpackCosmosConfigInput,
  rootDir: string
) {
  if (typeof configPath === 'undefined') {
    return resolvePath(rootDir, 'webpack.config.js');
  }

  // User can choose to prevent automatical use of an existing webpack.config.js
  // file (relative to the root dir) by setting configPath to null
  if (!configPath) {
    return null;
  }

  const absPath = resolvePath(rootDir, configPath);
  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`webpack config not found at path: ${relPath}`);
  }

  return absPath;
}

function getHotReload({ hotReload = true }: WebpackCosmosConfigInput) {
  return hotReload;
}

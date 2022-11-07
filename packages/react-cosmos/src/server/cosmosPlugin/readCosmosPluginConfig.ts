import path from 'path';
import resolveFrom from 'resolve-from';
import { CosmosPluginConfig, RawCosmosPluginConfig } from './types';

export function readCosmosPluginConfig(
  rootDir: string,
  moduleNameOrPath: string
): CosmosPluginConfig {
  const rawConfig = require(moduleNameOrPath) as RawCosmosPluginConfig;
  const pluginRootDir = path.dirname(moduleNameOrPath);
  const relativePluginRootDir = path.relative(rootDir, pluginRootDir);

  const config: CosmosPluginConfig = {
    name: rawConfig.name,
    rootDir: relativePluginRootDir,
  };

  if (rawConfig.ui) {
    config.ui = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.ui
    );
  }

  if (rawConfig.devServer) {
    config.devServer = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.devServer
    );
  }

  if (rawConfig.export) {
    config.export = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.export
    );
  }

  return config;
}

function resolvePluginPath(
  pluginName: string,
  rootDir: string,
  pluginRootDir: string,
  filePath: string
) {
  const absolutePath = path.join(pluginRootDir, filePath);
  const resolvedPath = resolveFrom.silent(rootDir, absolutePath);
  if (!resolvedPath) {
    throw new Error(`Invalid path in plugin "${pluginName}": ${filePath}`);
  }
  return path.relative(rootDir, resolvedPath);
}

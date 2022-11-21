import path from 'path';
import { CosmosPluginConfig, RawCosmosPluginConfig } from 'react-cosmos-core';
import { importModule } from '../utils/fs.js';
import { resolveSilent } from '../utils/resolveSilent.js';

export function readCosmosPluginConfig(
  rootDir: string,
  moduleNameOrPath: string
): CosmosPluginConfig {
  const rawConfig = importModule(moduleNameOrPath) as RawCosmosPluginConfig;
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
  const resolvedPath = resolveSilent(absolutePath);
  if (!resolvedPath) {
    throw new Error(`Invalid path in plugin "${pluginName}": ${filePath}`);
  }
  return path.relative(rootDir, resolvedPath);
}

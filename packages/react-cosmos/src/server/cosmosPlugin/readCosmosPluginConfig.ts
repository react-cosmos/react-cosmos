import path from 'path';
import { CosmosPluginConfig, RawCosmosPluginConfig } from 'react-cosmos-core';
import { importModule } from '../utils/fs.js';
import { resolveSilent } from '../utils/resolveSilent.js';

type ReadCosmosPluginConfigArgs = {
  rootDir: string;
  moduleNameOrPath: string;
  relativePaths: boolean;
};
export async function readCosmosPluginConfig({
  rootDir,
  moduleNameOrPath,
  relativePaths,
}: ReadCosmosPluginConfigArgs) {
  const rawConfig = await importModule<RawCosmosPluginConfig>(moduleNameOrPath);
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
      rawConfig.ui,
      relativePaths
    );
  }

  if (rawConfig.devServer) {
    config.devServer = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.devServer,
      relativePaths
    );
  }

  if (rawConfig.export) {
    config.export = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.export,
      relativePaths
    );
  }

  return config;
}

function resolvePluginPath(
  pluginName: string,
  rootDir: string,
  pluginRootDir: string,
  filePath: string,
  relativePath: boolean
) {
  const absolutePath = path.join(pluginRootDir, filePath);
  const resolvedPath = resolveSilent(absolutePath);
  if (!resolvedPath) {
    throw new Error(`Invalid path in plugin "${pluginName}": ${filePath}`);
  }
  return relativePath ? path.relative(rootDir, resolvedPath) : resolvedPath;
}

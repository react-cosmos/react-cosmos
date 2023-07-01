import path from 'path';
import { CosmosPluginConfig, RawCosmosPluginConfig } from 'react-cosmos-core';
import { importJson } from '../utils/fs.js';
import { resolveSilent } from '../utils/resolveSilent.js';

type ReadCosmosPluginConfigArgs = {
  rootDir: string;
  configPath: string;
  relativePaths: boolean;
};
export async function readCosmosPluginConfig({
  rootDir,
  configPath,
  relativePaths,
}: ReadCosmosPluginConfigArgs) {
  const rawConfig = await importJson<RawCosmosPluginConfig>(configPath);
  const pluginRootDir = path.dirname(configPath);

  const config: CosmosPluginConfig = {
    name: rawConfig.name,
    rootDir: relativePaths
      ? path.relative(rootDir, pluginRootDir)
      : pluginRootDir,
  };

  if (rawConfig.build) {
    config.build = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.build,
      relativePaths
    );
  }

  if (rawConfig.ui) {
    config.ui = resolvePluginPath(
      config.name,
      rootDir,
      pluginRootDir,
      rawConfig.ui,
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

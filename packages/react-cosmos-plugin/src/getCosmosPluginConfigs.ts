import glob from 'glob';
import path from 'path';
import resolveFrom from 'resolve-from';

// TODO: Validate config schema on config import
type RawCosmosPluginConfig = {
  name: string;
  uiPath?: string;
};

export type CosmosPluginConfig = {
  name: string;
  rootDir: string;
  uiPath?: string;
};

export function getCosmosPluginConfigs(rootDir: string) {
  const configPaths = getCosmosPluginConfigPaths(rootDir);
  return configPaths.map(configPath =>
    getCosmosPluginConfig(rootDir, configPath)
  );
}

function getCosmosPluginConfigPaths(rootDir: string) {
  return glob.sync('**/cosmos.plugin.json', {
    cwd: rootDir,
    absolute: true,
  });
}

export function getCosmosPluginConfig(
  rootDir: string,
  configPath: string
): CosmosPluginConfig {
  const rawConfig = require(configPath) as RawCosmosPluginConfig;
  const pluginRootDir = path.dirname(configPath);
  const relativePluginRootDir = path.relative(rootDir, pluginRootDir);

  const config: CosmosPluginConfig = {
    name: rawConfig.name,
    rootDir: relativePluginRootDir,
  };

  if (rawConfig.uiPath) {
    const uiPath = path.join(pluginRootDir, rawConfig.uiPath);
    const resolvedUiPath = resolveFrom.silent(pluginRootDir, uiPath);
    // TODO: Handle missing path
    if (resolvedUiPath) config.uiPath = path.relative(rootDir, resolvedUiPath);
  }

  return config;
}

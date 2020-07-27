import glob from 'glob';
import path from 'path';

// TODO: Validate config schema on config import
type RawCosmosPluginConfig = {
  name: string;
  ui: string[] | string;
};

export type CosmosPluginConfig = {
  name: string;
  ui: string[];
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
  const rawUi = Array.isArray(rawConfig.ui) ? rawConfig.ui : [rawConfig.ui];

  return {
    name: rawConfig.name,
    ui: rawUi.map(uiPath =>
      path.relative(rootDir, resolveModulePath(pluginRootDir, uiPath))
    ),
  };
}

function resolveModulePath(pluginRootDir: string, relativePath: string) {
  // TODO: Handle missing paths
  return require.resolve(path.resolve(pluginRootDir, relativePath));
}

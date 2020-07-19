import glob from 'glob';
import path from 'path';

// TODO: Validate config schema on config import
type RawCosmosPluginConfig = {
  name: string;
  ui: string[] | string;
};

type CosmosPluginConfig = {
  name: string;
  ui: string[];
};

export function getCosmosPluginConfigs(rootDir: string) {
  const configPaths = getCosmosPluginConfigPaths(rootDir);
  return configPaths.map(configPath => getCosmosPluginConfig(configPath));
}

function getCosmosPluginConfigPaths(rootDir: string) {
  return glob.sync('**/cosmos.plugin.json', {
    cwd: rootDir,
    absolute: true,
  });
}

export function getCosmosPluginConfig(configPath: string): CosmosPluginConfig {
  const rawConfig = require(configPath) as RawCosmosPluginConfig;
  const rootDir = path.dirname(configPath);
  const rawUi = Array.isArray(rawConfig.ui) ? rawConfig.ui : [rawConfig.ui];

  return {
    name: rawConfig.name,
    ui: rawUi.map(uiPath => resolveModulePath(rootDir, uiPath)),
  };
}

function resolveModulePath(rootDir: string, relativePath: string) {
  // TODO: Handle missing paths
  return require.resolve(path.resolve(rootDir, relativePath));
}

import glob from 'glob';
import path from 'path';

// TODO: Validate config schema on config import
type RawCosmosPluginConfig = {
  name: string;
};

export type CosmosPluginConfig = {
  name: string;
  rootDir: string;
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

  return {
    name: rawConfig.name,
    rootDir: path.relative(rootDir, pluginRootDir),
  };
}

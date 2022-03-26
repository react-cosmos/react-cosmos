import glob from 'glob';
import path from 'path';
import resolveFrom from 'resolve-from';

// TODO: Validate config schema on config import
type RawCosmosPluginConfig = {
  name: string;
  ui?: string;
};

export type CosmosPluginConfig = {
  name: string;
  rootDir: string;
  ui?: string;
};

type Args = {
  rootDir: string;
  ignore?: string[];
};
export function getCosmosPluginConfigs({ rootDir, ignore }: Args) {
  const configPaths = getCosmosPluginConfigPaths(rootDir, ignore);
  return configPaths.map(configPath =>
    getCosmosPluginConfig(rootDir, configPath)
  );
}

function getCosmosPluginConfigPaths(rootDir: string, ignore?: string[]) {
  return glob.sync('**/cosmos.plugin.json', {
    cwd: rootDir,
    absolute: true,
    ignore,
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

  if (rawConfig.ui) {
    const uiPath = path.join(pluginRootDir, rawConfig.ui);
    const resolvedUiPath = resolveFrom.silent(pluginRootDir, uiPath);
    // TODO: Handle missing path
    if (resolvedUiPath) config.ui = path.relative(rootDir, resolvedUiPath);
  }

  return config;
}

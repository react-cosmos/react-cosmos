import glob from 'glob';
import path from 'path';
import resolveFrom from 'resolve-from';
import { CosmosPluginConfig, RawCosmosPluginConfig } from './types';

type Args = {
  rootDir: string;
  ignore?: string[];
};
// TODO: Rename to detectLocalCosmosPlugins
export function getCosmosPluginConfigs({ rootDir, ignore }: Args) {
  const configPaths = getCosmosPluginConfigPaths(rootDir, ignore);
  return configPaths.map(configPath =>
    getCosmosPluginConfig(rootDir, configPath)
  );
}

const defaultIgnore = ['**/node_modules/**'];

function getCosmosPluginConfigPaths(rootDir: string, ignore = defaultIgnore) {
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
    if (resolvedUiPath) {
      config.ui = path.relative(rootDir, resolvedUiPath);
    }
  }

  if (rawConfig.devServer) {
    const devServerPath = path.join(pluginRootDir, rawConfig.devServer);
    const resolvedDevServerPath = resolveFrom.silent(
      pluginRootDir,
      devServerPath
    );
    // TODO: Handle missing path
    // TODO: Test
    if (resolvedDevServerPath) {
      config.devServer = path.relative(rootDir, resolvedDevServerPath);
    }
  }

  if (rawConfig.export) {
    const exportPath = path.join(pluginRootDir, rawConfig.export);
    const resolvedExportPath = resolveFrom.silent(pluginRootDir, exportPath);
    // TODO: Handle missing path
    // TODO: Test
    if (resolvedExportPath) {
      config.export = path.relative(rootDir, resolvedExportPath);
    }
  }

  return config;
}

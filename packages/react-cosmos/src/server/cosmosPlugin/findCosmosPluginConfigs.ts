import glob from 'glob';
import { readCosmosPluginConfig } from './readCosmosPluginConfig.js';

type Args = {
  rootDir: string;
  ignore?: string[];
};
export function findCosmosPluginConfigs({ rootDir, ignore }: Args) {
  const configPaths = findCosmosPluginConfigPaths(rootDir, ignore);
  return configPaths.map(configPath =>
    readCosmosPluginConfig(rootDir, configPath)
  );
}

const defaultIgnore = ['**/node_modules/**'];

function findCosmosPluginConfigPaths(rootDir: string, ignore = defaultIgnore) {
  return glob.sync('**/cosmos.plugin.json', {
    cwd: rootDir,
    absolute: true,
    ignore,
  });
}

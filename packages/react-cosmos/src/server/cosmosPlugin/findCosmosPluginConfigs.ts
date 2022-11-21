import glob from 'glob';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { readCosmosPluginConfig } from './readCosmosPluginConfig.js';

type Args = {
  rootDir: string;
  ignore?: string[];
};
export async function findCosmosPluginConfigs({
  rootDir,
  ignore,
}: Args): Promise<CosmosPluginConfig[]> {
  const configPaths = findCosmosPluginConfigPaths(rootDir, ignore);
  return Promise.all(
    configPaths.map(configPath => readCosmosPluginConfig(rootDir, configPath))
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

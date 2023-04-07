import path from 'path';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { pathToFileURL } from 'url';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';

export async function importServerPlugins(
  pluginConfigs: CosmosPluginConfig[],
  rootDir: string
) {
  return Promise.all(
    pluginConfigs
      .filter(pluginConfig => pluginConfig.server)
      .map(pluginConfig => importServerModule(pluginConfig, rootDir))
  );
}

async function importServerModule(
  pluginConfig: CosmosPluginConfig,
  rootDir: string
) {
  const moduleId = pluginConfig.server;
  if (!moduleId) {
    throw new Error(`Server module missing in plugin "${pluginConfig.name}"`);
  }

  const esModule = await import(
    pathToFileURL(path.resolve(rootDir, moduleId)).href
  );
  return esModule.default as CosmosServerPlugin;
}

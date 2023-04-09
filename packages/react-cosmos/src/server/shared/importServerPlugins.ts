import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { importModule } from '../utils/fs.js';

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

  const fileUrl = pathToFileURL(path.resolve(rootDir, moduleId)).href;
  const module = await importModule<{ default: CosmosServerPlugin }>(fileUrl);
  return module.default;
}

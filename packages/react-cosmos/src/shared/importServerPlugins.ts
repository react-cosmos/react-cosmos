import path from 'node:path';
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
  const modulePath = pluginConfig.server;
  if (!modulePath) {
    throw new Error(`Server module missing in plugin "${pluginConfig.name}"`);
  }

  const absPath = path.resolve(rootDir, modulePath);
  const module = await importModule<{ default: CosmosServerPlugin }>(absPath);
  return module.default;
}

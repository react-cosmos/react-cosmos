import path from 'node:path';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosBuildPlugin } from '../cosmosPlugin/types.js';
import { importModule } from '../utils/fs.js';

export async function importBuildPlugins(
  pluginConfigs: CosmosPluginConfig[],
  rootDir: string
) {
  return Promise.all(
    pluginConfigs
      .filter(pluginConfig => pluginConfig.build)
      .map(pluginConfig => importBuildModule(pluginConfig, rootDir))
  );
}

async function importBuildModule(
  pluginConfig: CosmosPluginConfig,
  rootDir: string
) {
  const modulePath = pluginConfig.build;
  if (!modulePath) {
    throw new Error(`Build module missing in plugin "${pluginConfig.name}"`);
  }

  const absPath = path.resolve(rootDir, modulePath);
  const module = await importModule<{ default: CosmosBuildPlugin }>(absPath);
  return module.default;
}

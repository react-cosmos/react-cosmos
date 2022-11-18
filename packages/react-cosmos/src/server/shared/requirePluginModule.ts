import path from 'path';
import { CosmosPluginConfig } from '../cosmosPlugin/types.js';

export async function requirePluginModule<T>(
  rootDir: string,
  pluginConfig: CosmosPluginConfig,
  configKey: 'ui' | 'devServer' | 'export'
) {
  const moduleId = pluginConfig[configKey];
  if (!moduleId) {
    throw new Error(
      `Module missing in plugin "${pluginConfig.name}": ${configKey}`
    );
  }

  const esModule = await import(path.resolve(rootDir, moduleId));
  return esModule.default as T;
}

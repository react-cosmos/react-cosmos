import path from 'path';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { pathToFileURL } from 'url';

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

  const esModule = await import(
    pathToFileURL(path.resolve(rootDir, moduleId)).href
  );
  return esModule.default as T;
}

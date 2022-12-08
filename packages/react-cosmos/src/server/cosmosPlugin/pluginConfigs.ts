import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs.js';
import { readCosmosPluginConfig } from './readCosmosPluginConfig.js';

type GetPluginConfigArgs = {
  cosmosConfig: CosmosConfig;
  relativePaths: boolean;
};
export async function getPluginConfigs({
  cosmosConfig,
  relativePaths,
}: GetPluginConfigArgs): Promise<CosmosPluginConfig[]> {
  const { rootDir, disablePlugins, plugins, exportPath } = cosmosConfig;

  if (disablePlugins) return [];

  const moduleConfigs = await Promise.all(
    plugins.map(pluginId =>
      readCosmosPluginConfig({
        rootDir,
        moduleNameOrPath: pluginId,
        relativePaths,
      })
    )
  );

  const localConfigs = await findCosmosPluginConfigs({
    rootDir,
    ignore: [`${exportPath}/**`],
    relativePaths,
  });

  return [...moduleConfigs, ...localConfigs];
}

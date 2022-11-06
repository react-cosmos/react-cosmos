import { CosmosPluginConfig } from '../cosmosPlugin/types';

export function logPluginInfo(pluginConfigs: CosmosPluginConfig[]) {
  const pluginCount = pluginConfigs.length;
  if (pluginCount > 0) {
    const pluginLabel = pluginCount === 1 ? 'plugin' : 'plugins';
    const pluginNames = pluginConfigs.map(p => p.name).join(', ');
    console.log(`[Cosmos] Found ${pluginCount} ${pluginLabel}: ${pluginNames}`);
  }
}

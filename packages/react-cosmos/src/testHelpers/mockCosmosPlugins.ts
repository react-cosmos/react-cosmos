import { CosmosPluginConfig } from 'react-cosmos-core';
import { vi } from 'vitest';

vi.mock('../cosmosPlugin/findCosmosPluginConfigs.js', () => {
  let pluginConfigs: CosmosPluginConfig[] = [];

  return {
    async findCosmosPluginConfigs() {
      return Promise.resolve(pluginConfigs);
    },

    __mockCosmosPluginConfigs(configs: CosmosPluginConfig[]) {
      pluginConfigs = configs;
    },
  };
});

export async function mockCosmosPlugins(configs: CosmosPluginConfig[]) {
  // @ts-ignore FIXME
  (await importMocked()).__mockCosmosPluginConfigs(configs);
}

async function importMocked() {
  return import('../cosmosPlugin/findCosmosPluginConfigs.js');
}

import { CosmosPluginConfig } from 'react-cosmos-core';
import { vi } from 'vitest';

type ActualApi = typeof import('../cosmosPlugin/findCosmosPluginConfigs.js');

type MockApi = ActualApi & {
  __mockCosmosPluginConfigs: (configs: CosmosPluginConfig[]) => void;
};

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
  (await importMocked()).__mockCosmosPluginConfigs(configs);
}

async function importMocked() {
  return import('../cosmosPlugin/findCosmosPluginConfigs.js') as Promise<MockApi>;
}

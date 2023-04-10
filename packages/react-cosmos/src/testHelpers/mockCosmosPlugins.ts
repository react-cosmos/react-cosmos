import { CosmosPluginConfig } from 'react-cosmos-core';

jest.mock('../cosmosPlugin/findCosmosPluginConfigs.js', () => {
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

export function mockCosmosPlugins(configs: CosmosPluginConfig[]) {
  requireMocked().__mockCosmosPluginConfigs(configs);
}

function requireMocked() {
  return require('../cosmosPlugin/findCosmosPluginConfigs.js');
}

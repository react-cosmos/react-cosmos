import { CosmosConfig } from 'react-cosmos/server.js';

type ViteCosmosConfig = {
  port: number;
};

type ViteCosmosConfigInput = Partial<ViteCosmosConfig>;

export function createViteCosmosConfig(
  cosmosConfig: CosmosConfig
): ViteCosmosConfig {
  const configInput: ViteCosmosConfigInput = cosmosConfig.vite || {};

  return {
    port: configInput.port || 5050,
  };
}

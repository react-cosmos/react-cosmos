import { CosmosConfig } from 'react-cosmos';

export type ViteCosmosConfig = {
  configPath: string | null | false;
  port: number;
};

type ViteCosmosConfigInput = Partial<ViteCosmosConfig>;

export function createViteCosmosConfig(
  cosmosConfig: CosmosConfig
): ViteCosmosConfig {
  const configInput: ViteCosmosConfigInput = cosmosConfig.vite || {};

  return {
    configPath: configInput.configPath || null,
    port: configInput.port ?? 5050,
  };
}

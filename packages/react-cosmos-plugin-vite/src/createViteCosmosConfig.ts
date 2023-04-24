import { CosmosConfig } from 'react-cosmos';

export type ViteCosmosConfig = {
  configPath: string | null | false;
  port: number;
};

type ViteCosmosConfigInput = Partial<ViteCosmosConfig>;

export const DEFAULT_VITE_PORT = 5050;

export function createViteCosmosConfig(
  cosmosConfig: CosmosConfig
): ViteCosmosConfig {
  const configInput: ViteCosmosConfigInput = cosmosConfig.vite || {};

  return {
    configPath: configInput.configPath || null,
    port: configInput.port || DEFAULT_VITE_PORT,
  };
}

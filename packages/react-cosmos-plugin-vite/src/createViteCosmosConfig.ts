import { CosmosConfig, resolveLoose } from 'react-cosmos';

export type ViteCosmosConfig = {
  configPath: string | null | false;
  indexPath: string | null;
  port: number;
};

type ViteCosmosConfigInput = Partial<ViteCosmosConfig>;

export function createViteCosmosConfig(
  cosmosConfig: CosmosConfig
): ViteCosmosConfig {
  const { rootDir } = cosmosConfig;
  const configInput: ViteCosmosConfigInput = cosmosConfig.vite || {};

  return {
    configPath: configInput.configPath ?? null,

    indexPath: configInput.indexPath
      ? resolveLoose(rootDir, configInput.indexPath)
      : null,

    port: configInput.port ?? 5050,
  };
}

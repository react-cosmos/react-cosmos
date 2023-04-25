import { CosmosConfig, resolveLoose } from 'react-cosmos';

export type ViteCosmosConfig = {
  configPath: string | null | false;
  indexFile: string | null;
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

    indexFile: configInput.indexFile
      ? resolveLoose(rootDir, configInput.indexFile)
      : null,

    port: configInput.port ?? 5050,
  };
}

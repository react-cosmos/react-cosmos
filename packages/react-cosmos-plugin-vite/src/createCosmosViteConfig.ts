import { CosmosConfig, resolveLoose } from 'react-cosmos';

export type CosmosViteConfig = {
  configPath: string | null | false;
  indexPath: string | null;
  port: number;
};

type CosmosViteConfigInput = Partial<CosmosViteConfig>;

export function createCosmosViteConfig(
  cosmosConfig: CosmosConfig
): CosmosViteConfig {
  const { rootDir } = cosmosConfig;
  const configInput: CosmosViteConfigInput = cosmosConfig.vite || {};

  return {
    configPath: configInput.configPath ?? null,

    indexPath: configInput.indexPath
      ? resolveLoose(rootDir, configInput.indexPath)
      : null,

    port: getCosmosVitePort(configInput),
  };
}

export function getCosmosVitePort(cosmosViteConfig: CosmosViteConfigInput) {
  const { port = 5050 } = cosmosViteConfig;
  return port;
}

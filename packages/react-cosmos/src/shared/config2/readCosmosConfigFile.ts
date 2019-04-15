import { CosmosConfig } from './shared';

// NOTE: This file has been extracted to be easily mocked inside tests
export function readCosmosConfigFile(
  cosmosConfigPath: string
): null | CosmosConfig {
  try {
    return require(cosmosConfigPath);
  } catch (err) {
    return null;
  }
}

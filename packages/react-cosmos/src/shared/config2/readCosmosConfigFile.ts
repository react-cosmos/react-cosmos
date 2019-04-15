// NOTE: This file has been extracted to be easily mocked inside tests
import { existsSync } from 'fs';
import { CosmosConfig } from './shared';

export function readCosmosConfigFile(
  cosmosConfigPath: string
): null | CosmosConfig {
  try {
    return require(cosmosConfigPath);
  } catch (err) {
    return null;
  }
}

export function cosmosConfigFileExists(cosmosConfigPath: string) {
  return existsSync(cosmosConfigPath);
}

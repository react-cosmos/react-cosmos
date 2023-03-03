import path from 'path';
import { createCosmosConfig } from './createCosmosConfig.js';
import { importConfigFile } from './shared.js';
import { CosmosConfigInput } from './types.js';

export async function getCosmosConfigAtPath(cosmosConfigPath: string) {
  const cosmosConfigInput = await importConfigFile(cosmosConfigPath);
  const rootDir = deriveRootDir(cosmosConfigPath, cosmosConfigInput);
  return createCosmosConfig(rootDir, cosmosConfigInput);
}

function deriveRootDir(
  cosmosConfigPath: string,
  { rootDir }: CosmosConfigInput
) {
  const configDir = path.dirname(cosmosConfigPath);
  return rootDir ? path.resolve(configDir, rootDir) : configDir;
}

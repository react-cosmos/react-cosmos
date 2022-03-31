import path from 'path';
import { createCosmosConfig } from './createCosmosConfig';
import { requireConfigFile } from './shared';
import { CosmosConfigInput } from './types';

export function getCosmosConfigAtPath(cosmosConfigPath: string) {
  const cosmosConfigInput = requireConfigFile(cosmosConfigPath);
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

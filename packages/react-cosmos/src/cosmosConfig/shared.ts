import { importJson } from '../utils/fs.js';
import type { CosmosConfigInput } from './types.js';

export function getCurrentDir() {
  return process.cwd();
}

export async function importConfigFile(cosmosConfigPath: string) {
  return importJson<CosmosConfigInput>(cosmosConfigPath);
}

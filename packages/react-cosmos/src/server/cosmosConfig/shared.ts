import { importModule } from '../utils/fs.js';
import { CosmosConfigInput } from './types.js';

export function getCurrentDir() {
  return process.cwd();
}

export async function importConfigFile(
  cosmosConfigPath: string
): Promise<CosmosConfigInput> {
  return importModule(cosmosConfigPath);
}

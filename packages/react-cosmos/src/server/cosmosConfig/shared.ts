import { requireModule } from '../utils/fs.js';
import { CosmosConfigInput } from './types.js';

export function getCurrentDir() {
  return process.cwd();
}

export function requireConfigFile(cosmosConfigPath: string): CosmosConfigInput {
  return requireModule(cosmosConfigPath);
}

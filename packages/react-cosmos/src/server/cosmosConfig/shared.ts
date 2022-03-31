import { requireModule } from '../fs';
import { CosmosConfigInput } from './types';

export function getCurrentDir() {
  return process.cwd();
}

export function requireConfigFile(cosmosConfigPath: string): CosmosConfigInput {
  return requireModule(cosmosConfigPath);
}

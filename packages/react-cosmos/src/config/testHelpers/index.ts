import path from 'path';
import { slash } from '../../shared/slash';
import { CosmosConfig } from '../shared';
import { __mockFile, __mockDir, __unmockFs } from './fs';

export function getCwdPath(relPath?: string) {
  return relPath ? slash(process.cwd(), relPath) : process.cwd();
}

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: Partial<CosmosConfig>
) {
  const absPath = getCwdPath(cosmosConfigPath);
  __mockFile(absPath, cosmosConfig);
  __mockDir(path.dirname(absPath));
}

export function mockDir(dirPath: string) {
  __mockDir(getCwdPath(dirPath));
}

export function unmockFs() {
  __unmockFs();
}

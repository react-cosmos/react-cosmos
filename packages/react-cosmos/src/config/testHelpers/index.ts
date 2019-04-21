import path from 'path';
import { getCwdPath } from '../../testHelpers/cwd';
import { CosmosConfig } from '../shared';
import { __mockFile, __mockDir, __unmockFs } from './fs';

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

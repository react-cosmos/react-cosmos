import path from 'path';
import { slash } from '../../slash';
import { RawCosmosConfig } from '../shared';
import { mockArgv } from './mockYargs';
import { __mockFile, __mockDir, __unmockFs } from './fs';

export function getCwdPath(relPath?: string) {
  return relPath ? slash(process.cwd(), relPath) : process.cwd();
}

export function mockCliArgs(cliArgs: {}) {
  mockArgv(cliArgs);
}

export function unmockCliArgs() {
  mockArgv({});
}

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: RawCosmosConfig
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

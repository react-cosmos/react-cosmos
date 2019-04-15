import path from 'path';
import { slash } from '../../slash';
import { CosmosConfig } from '../shared';
import { mockProcessCwd, unmockProcessCwd } from './mockProcessCwd';
import { mockArgv } from './mockYargs';
import { __mockFile, __mockDir, __unmockFs } from './fs';

export function getCwdPath(relPath?: string) {
  return relPath ? slash(getMockCwd(), relPath) : getMockCwd();
}

export function mockCwd() {
  mockProcessCwd(getMockCwd());
}

export function unmockCwd() {
  unmockProcessCwd();
}

export function mockCliArgs(cliArgs: {}) {
  mockArgv(cliArgs);
}

export function unmockCliArgs() {
  mockArgv({});
}

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: CosmosConfig
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

function getMockCwd() {
  return __dirname;
}

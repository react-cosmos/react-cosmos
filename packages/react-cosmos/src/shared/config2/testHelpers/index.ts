import { slash } from '../../slash';
import { CosmosConfig } from '../shared';
import { mockProcessCwd, unmockProcessCwd } from './mockProcessCwd';
import { mockArgv } from './mockYargs';
import { __mockFile, __mockDir, __unmockFs } from './fs';

export function getCwdPath(relPath?: string) {
  return relPath ? slash(getMockCwd(), relPath) : getMockCwd();
}

export function mockCliArgs(cliArgs: {}) {
  mockProcessCwd(getMockCwd());
  mockArgv(cliArgs);
}

export function unmockCliArgs() {
  unmockProcessCwd();
  mockArgv({});
}

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: CosmosConfig
) {
  __mockFile(getCwdPath(cosmosConfigPath), cosmosConfig);
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

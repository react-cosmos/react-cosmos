import { slash } from '../../slash';
import { CosmosConfig } from '../shared';
import { mockProcessCwd, unmockProcessCwd } from './mockProcessCwd';
import { mockArgv } from './mockYargs';
import {
  mockCosmosConfigFile,
  unmockCosmosConfigFile
} from './mockCosmosConfigFile';

export function getCwdPath(relPath?: string) {
  return relPath ? slash(getMockCwd(), relPath) : getMockCwd();
}

export function mockCliArgs(cliArgs: {}, cb: () => unknown) {
  expect.hasAssertions();
  mockProcessCwd(getMockCwd());
  mockArgv(cliArgs);
  cb();
  unmockProcessCwd();
  mockArgv({});
}

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: CosmosConfig,
  cb: () => unknown
) {
  expect.hasAssertions();
  mockCosmosConfigFile(getCwdPath(cosmosConfigPath), cosmosConfig);
  cb();
  unmockCosmosConfigFile();
}

function getMockCwd() {
  return __dirname;
}

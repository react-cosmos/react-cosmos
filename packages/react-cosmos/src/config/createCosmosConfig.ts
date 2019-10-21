import path from 'path';
import { getCliArgs } from '../shared/cli';
import { resolveModule, resolvePath } from './resolve';
import { CosmosConfig, CosmosConfigInput } from './shared';

export function createCosmosConfig(
  rootDir: string,
  cosmosConfigInput: CosmosConfigInput = {}
): CosmosConfig {
  return {
    ...cosmosConfigInput,
    rootDir,
    exportPath: getExportPath(cosmosConfigInput, rootDir),
    staticPath: getStaticPath(cosmosConfigInput, rootDir),
    publicUrl: getPublicUrl(cosmosConfigInput),
    fixturesDir: getFixturesDir(cosmosConfigInput),
    fixtureFileSuffix: getFixtureFileSuffix(cosmosConfigInput),
    watchDirs: getWatchDirs(cosmosConfigInput, rootDir),
    userDepsFilePath: getUserDepsFilePath(cosmosConfigInput, rootDir),
    hostname: getHostname(cosmosConfigInput),
    port: getPort(cosmosConfigInput),
    globalImports: getGlobalImports(cosmosConfigInput, rootDir),
    ui: cosmosConfigInput.ui || {}
  };
}

function getExportPath(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { exportPath = 'cosmos-export' } = cosmosConfigInput;
  return resolvePath(rootDir, exportPath);
}

function getStaticPath(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { staticPath = null } = cosmosConfigInput;
  return staticPath && resolvePath(rootDir, staticPath);
}

function getPublicUrl({ publicUrl = '/' }: CosmosConfigInput) {
  return publicUrl;
}

function getFixturesDir({ fixturesDir = '__fixtures__' }: CosmosConfigInput) {
  return fixturesDir;
}

function getFixtureFileSuffix({
  fixtureFileSuffix = 'fixture'
}: CosmosConfigInput) {
  return fixtureFileSuffix;
}

function getWatchDirs(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { watchDirs = ['.'] } = cosmosConfigInput;
  // Watchpack v1.6.0 (and by extensions webpack v4) has problems watching
  // directories with forward slashes on Windows. Use backslashes until it gets
  // fixed.
  // See https://github.com/webpack/watchpack/issues/123 and
  // https://github.com/react-cosmos/react-cosmos/issues/1069
  return watchDirs.map(watchDir => path.resolve(rootDir, watchDir));
}

function getUserDepsFilePath(
  cosmosConfigInput: CosmosConfigInput,
  rootDir: string
) {
  const { userDepsFilePath = 'cosmos.userdeps.js' } = cosmosConfigInput;
  return resolvePath(rootDir, userDepsFilePath);
}

function getHostname({ hostname = null }: CosmosConfigInput) {
  return hostname;
}

function getPort(cosmosConfigInput: CosmosConfigInput) {
  const cliArgs = getCliArgs();
  if (typeof cliArgs.port === 'number') {
    return cliArgs.port;
  }

  const { port = 5000 } = cosmosConfigInput;
  return port;
}

function getGlobalImports(
  cosmosConfigInput: CosmosConfigInput,
  rootDir: string
) {
  const { globalImports = [] } = cosmosConfigInput;
  return globalImports.map(globalImport =>
    resolveModule(rootDir, globalImport)
  );
}

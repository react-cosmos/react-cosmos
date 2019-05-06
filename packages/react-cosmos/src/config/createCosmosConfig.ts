import path from 'path';
import { CosmosConfig, getCliArgs, getRootDirAtPath } from './shared';
import { getCosmosConfigPath } from './cosmosConfigPath';
import { resolvePath, resolveModule } from './resolve';

type CosmosConfigInput = Partial<CosmosConfig>;

export function createCosmosConfig(
  cosmosConfigInput: CosmosConfigInput = {}
): CosmosConfig {
  const cosmosConfigPath = getCosmosConfigPath();
  const rootDir = getRootDir(cosmosConfigInput, cosmosConfigPath);
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

function getRootDir({ rootDir }: CosmosConfigInput, cosmosConfigPath: string) {
  const cliArgs = getCliArgs();
  if (typeof cliArgs.rootDir === 'string') {
    return getRootDirAtPath(cliArgs.rootDir);
  }

  const configDir = path.dirname(cosmosConfigPath);
  return rootDir ? path.resolve(configDir, rootDir) : configDir;
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
  return watchDirs.map(watchDir => resolvePath(rootDir, watchDir));
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

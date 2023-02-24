import path from 'path';
import { getCliArgs } from '../utils/cli.js';
import { resolveLoose } from '../utils/resolveLoose.js';
import { CosmosConfig, CosmosConfigInput } from './types.js';

export function createCosmosConfig(
  rootDir: string,
  cosmosConfigInput: CosmosConfigInput = {}
): CosmosConfig {
  return {
    ...cosmosConfigInput,
    rootDir,
    exportPath: getExportPath(cosmosConfigInput, rootDir),
    detectLocalPlugins: cosmosConfigInput.detectLocalPlugins ?? true,
    disablePlugins: cosmosConfigInput.disablePlugins ?? false,
    fixtureFileSuffix: getFixtureFileSuffix(cosmosConfigInput),
    fixturesDir: getFixturesDir(cosmosConfigInput),
    globalImports: getGlobalImports(cosmosConfigInput, rootDir),
    hostname: getHostname(cosmosConfigInput),
    https: getHttps(cosmosConfigInput),
    httpsOptions: getHttpsOptions(cosmosConfigInput, rootDir),
    port: getPort(cosmosConfigInput),
    plugins: getPlugins(cosmosConfigInput, rootDir),
    publicUrl: getPublicUrl(cosmosConfigInput),
    staticPath: getStaticPath(cosmosConfigInput, rootDir),
    userDepsFilePath: getUserDepsFilePath(cosmosConfigInput, rootDir),
    watchDirs: getWatchDirs(cosmosConfigInput, rootDir),
    rendererUrl: cosmosConfigInput.rendererUrl ?? null,
    ui: cosmosConfigInput.ui || {},
  };
}

function getExportPath(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { exportPath = 'cosmos-export' } = cosmosConfigInput;
  return path.resolve(rootDir, exportPath);
}

function getStaticPath(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { staticPath = null } = cosmosConfigInput;
  return staticPath && path.resolve(rootDir, staticPath);
}

function getHttps(cosmosConfigInput: CosmosConfigInput) {
  const { https = false } = cosmosConfigInput;
  return https;
}

function getHttpsOptions(
  cosmosConfigInput: CosmosConfigInput,
  rootDir: string
) {
  if (
    cosmosConfigInput.httpsOptions?.keyPath &&
    cosmosConfigInput.httpsOptions?.certPath
  ) {
    return {
      keyPath: path.resolve(rootDir, cosmosConfigInput.httpsOptions.keyPath),
      certPath: path.resolve(rootDir, cosmosConfigInput.httpsOptions.certPath),
    };
  }
  return null;
}

function getPublicUrl({ publicUrl = '/' }: CosmosConfigInput) {
  return publicUrl;
}

function getFixturesDir({ fixturesDir = '__fixtures__' }: CosmosConfigInput) {
  return fixturesDir;
}

function getFixtureFileSuffix({
  fixtureFileSuffix = 'fixture',
}: CosmosConfigInput) {
  return fixtureFileSuffix;
}

function getWatchDirs(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { watchDirs = ['.'] } = cosmosConfigInput;
  return watchDirs.map(watchDir => path.resolve(rootDir, watchDir));
}

function getUserDepsFilePath(
  cosmosConfigInput: CosmosConfigInput,
  rootDir: string
) {
  const { userDepsFilePath = 'cosmos.userdeps.js' } = cosmosConfigInput;
  return path.resolve(rootDir, userDepsFilePath);
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
  return globalImports.map(globalImport => resolveLoose(rootDir, globalImport));
}

function getPlugins(cosmosConfigInput: CosmosConfigInput, rootDir: string) {
  const { plugins = [] } = cosmosConfigInput;
  return plugins.map(plugin => resolveLoose(rootDir, plugin));
}

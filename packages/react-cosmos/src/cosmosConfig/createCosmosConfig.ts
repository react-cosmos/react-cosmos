import path from 'path';
import { getCliArgs } from '../utils/cli.js';
import { resolveLoose } from '../utils/resolveLoose.js';
import { resolveSilent } from '../utils/resolveSilent.js';
import {
  CosmosConfig,
  CosmosConfigInput,
  CosmosDomConfigInput,
} from './types.js';

export function createCosmosConfig(
  rootDir: string,
  cosmosConfigInput: CosmosConfigInput = {}
): CosmosConfig {
  const typeScript = getTypeScript(cosmosConfigInput);
  return {
    ...cosmosConfigInput,
    rootDir,
    detectLocalPlugins: cosmosConfigInput.detectLocalPlugins ?? true,
    disablePlugins: cosmosConfigInput.disablePlugins ?? false,
    exportPath: getExportPath(cosmosConfigInput, rootDir),
    fixtureFileSuffix: getFixtureFileSuffix(cosmosConfigInput),
    fixturesDir: getFixturesDir(cosmosConfigInput),
    globalImports: getGlobalImports(cosmosConfigInput, rootDir),
    hostname: getHostname(cosmosConfigInput),
    https: getHttps(cosmosConfigInput),
    httpsOptions: getHttpsOptions(cosmosConfigInput, rootDir),
    ignore: getIgnore(cosmosConfigInput),
    lazy: getLazy(cosmosConfigInput),
    plugins: getPlugins(cosmosConfigInput, rootDir),
    port: getPort(cosmosConfigInput),
    portRetries: getPortRetries(cosmosConfigInput),
    publicUrl: getPublicUrl(cosmosConfigInput),
    rendererUrl: cosmosConfigInput.rendererUrl ?? null,
    staticPath: getStaticPath(cosmosConfigInput, rootDir),
    typeScript,
    userDepsFilePath: getUserDepsFilePath(
      cosmosConfigInput,
      rootDir,
      typeScript
    ),
    watchDirs: getWatchDirs(cosmosConfigInput, rootDir),
    dom: getDomConfig(cosmosConfigInput.dom || {}),
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

function getIgnore({ ignore = [] }: CosmosConfigInput) {
  return ['**/node_modules/**', ...ignore];
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
  rootDir: string,
  typeScript: boolean
) {
  const ext = typeScript ? 'ts' : 'js';
  const { userDepsFilePath = `cosmos.userdeps.${ext}` } = cosmosConfigInput;
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

function getPortRetries({ portRetries = 10 }: CosmosConfigInput) {
  return portRetries;
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

function getDomConfig(cosmosConfigInput: CosmosDomConfigInput) {
  const { containerQuerySelector = null } = cosmosConfigInput;
  return {
    containerQuerySelector,
  };
}

function getLazy(cosmosConfigInput: CosmosConfigInput) {
  const cliArgs = getCliArgs();
  if (typeof cliArgs.lazy === 'boolean') {
    return cliArgs.lazy;
  }

  const { lazy = false } = cosmosConfigInput;
  return lazy;
}

function getTypeScript({ typeScript }: CosmosConfigInput) {
  return typeof typeScript === 'undefined'
    ? Boolean(resolveSilent('typescript'))
    : typeScript;
}

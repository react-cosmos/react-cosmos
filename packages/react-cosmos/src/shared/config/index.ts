import path from 'path';
import { argv } from 'yargs';
import { slash } from '../slash';

export type RawCosmosConfig = {
  hostname?: null | string;
  port?: number;
  rootDir?: string;
  publicUrl?: string;
  fixtureFileSuffix?: string;
  fixturesDir?: string;
  webpackConfigPath?: string;
  globalImports?: string[];
  containerQuerySelector?: string;
  watchDirs?: string[];
  userDepsPath?: string;
  staticPath?: string;
  exportPath?: string;
};

export type CosmosConfig = {
  hostname: null | string;
  port: number;
  rootDir: string;
  publicUrl: string;
  fixtureFileSuffix: string;
  fixturesDir: string;
  webpackConfigPath: null | string;
  globalImports: string[];
  containerQuerySelector: null | string;
  watchDirs: string[];
  userDepsPath: string;
  staticPath: null | string;
  exportPath: string;
};

export function getCosmosConfig() {
  // TODO: Read cosmos config from current dir
  const COSMOS_CONFIG: RawCosmosConfig = {};
  return getComputedCosmosConfig(COSMOS_CONFIG);
}

function getComputedCosmosConfig(
  rawCosmosConfig: RawCosmosConfig = {}
): CosmosConfig {
  return {
    // TODO: Make this transformation smarter
    rootDir: getRootDir(rawCosmosConfig),
    port: getPort(rawCosmosConfig),
    hostname: rawCosmosConfig.hostname || null,
    publicUrl: rawCosmosConfig.publicUrl || '/',
    fixtureFileSuffix: rawCosmosConfig.fixtureFileSuffix || 'fixture',
    fixturesDir: rawCosmosConfig.fixturesDir || '__fixtures__',
    webpackConfigPath:
      typeof rawCosmosConfig.webpackConfigPath === 'string'
        ? rawCosmosConfig.webpackConfigPath
        : null,
    // TODO: Resolve global imports
    globalImports: rawCosmosConfig.globalImports || [],
    containerQuerySelector:
      typeof rawCosmosConfig.containerQuerySelector === 'string'
        ? rawCosmosConfig.containerQuerySelector
        : null,
    watchDirs: getWatchDirs(rawCosmosConfig),
    userDepsPath: getUserDepsPath(rawCosmosConfig),
    staticPath: getStaticPath(rawCosmosConfig),
    exportPath: getExportPath(rawCosmosConfig)
  };
}

function getRootDir({ rootDir }: RawCosmosConfig): string {
  // IDEA: Add support for --root-dir
  const currentDir = process.cwd();
  const projectDir =
    typeof argv.config === 'string'
      ? path.dirname(path.resolve(currentDir, argv.config))
      : currentDir;

  return rootDir ? path.resolve(projectDir, rootDir) : projectDir;
}

export function getPort(cosmosConfig: RawCosmosConfig) {
  if (typeof argv.port === 'number') {
    return argv.port;
  }

  return cosmosConfig.port || 5000;
}

export function getWatchDirs(cosmosConfig: RawCosmosConfig) {
  const { watchDirs = ['.'] } = cosmosConfig;
  const rootDir = getRootDir(cosmosConfig);
  return watchDirs.map(dirPath => slash(path.resolve(rootDir, dirPath)));
}

export function getUserDepsPath(cosmosConfig: RawCosmosConfig) {
  const { userDepsPath = 'cosmos.userdeps.js' } = cosmosConfig;
  const rootDir = getRootDir(cosmosConfig);
  return slash(path.resolve(rootDir, userDepsPath));
}

export function getStaticPath(cosmosConfig: RawCosmosConfig) {
  const { staticPath } = cosmosConfig;
  if (!staticPath) {
    return null;
  }

  const rootDir = getRootDir(cosmosConfig);
  return slash(path.resolve(rootDir, staticPath));
}

export function getExportPath(cosmosConfig: RawCosmosConfig) {
  const { exportPath = 'cosmos-export' } = cosmosConfig;
  const rootDir = getRootDir(cosmosConfig);
  return slash(path.resolve(rootDir, exportPath));
}

// TODO: Group options
// Eg.
// {
//   dom: {
//     containerQuerySelector,
//   },
//   renderer: {
//     globalImports,
//   },
//   server: {
//     fixtureFileSuffix,
//     fixturesDir,
//     hostname,
//     httpProxy,
//     port,
//     rootDir,
//     watchDirs,
//     webpack: {
//       configPath,
//       hotReload,
//       override
//     }
//   }
// }
// TODO: Make all options optional
// export type CosmosConfig = {
//   containerQuerySelector?: string;
//   exportPath?: string;
//   fixtureFileSuffix: string;
//   fixturesDir: string;
//   globalImports: string[];
//   // From Node.js docs: If host is omitted, the server will accept connections
//   // https://github.com/react-cosmos/react-cosmos/issues/639
//   // on the unspecified IPv6 address (::) when IPv6 is available, or the
//   // This is particularly useful when running Cosmos inside a Docker container
//   // unspecified IPv4 address (0.0.0.0) otherwise.
//   hostname: null | string;
//   hotReload: boolean;
//   httpProxy?: HttpProxyConfig;
//   // Only used by the React Native server, modulesPath specifies where to
//   // generate the file with imports to all user fixtures and decorators.
//   // Whereas most of the other paths are used to import modules, modulesPath is
//   // used as an output file path and it requires a file extension.
//   // TODO: Control using additional boolean flag writeModulesFile?
//   modulesPath: string;
//   port: number;
//   publicPath?: string;
//   publicUrl?: string;
//   rootDir?: string;
//   watchDirs: string[];
//   webpackConfigPath?: string;
// };
// export const COSMOS_CONFIG: CosmosConfig = {
//   // TODO: Move (most of) these values into defaults
//   fixtureFileSuffix: 'fixture',
//   fixturesDir: '__fixtures__',
//   globalImports: [],
//   hostname: null,
//   hotReload: true,
//   port: 5000,
//   watchDirs: ['.'],
//   modulesPath: 'cosmos.modules.js'
// };

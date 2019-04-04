import path from 'path';
import { argv } from 'yargs';
import webpack from 'webpack';
import { HttpProxyConfig } from './httpProxy';
import { slash } from './slash';

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
export type CosmosConfig = {
  containerQuerySelector?: string;
  exportPath?: string;
  fixtureFileSuffix: string;
  fixturesDir: string;
  globalImports: string[];
  // From Node.js docs: If host is omitted, the server will accept connections
  // https://github.com/react-cosmos/react-cosmos/issues/639
  // on the unspecified IPv6 address (::) when IPv6 is available, or the
  // This is particularly useful when running Cosmos inside a Docker container
  // unspecified IPv4 address (0.0.0.0) otherwise.
  hostname: null | string;
  hotReload: boolean;
  httpProxy?: HttpProxyConfig;
  port: number;
  publicPath?: string;
  publicUrl?: string;
  rootDir?: string;
  watchDirs: string[];
  webpackConfigPath?: string;
  webpackOverride?: (
    config: webpack.Configuration,
    opts: { env: string }
  ) => webpack.Configuration;
};

// TODO: Convert constants from this file into user config. But keep these
// values hardcoded in the beta-testing period. This simplifies development and
// promotes designing of good defaults.
// Related https://github.com/react-cosmos/react-cosmos/issues/488
export const COSMOS_CONFIG: CosmosConfig = {
  fixtureFileSuffix: 'jsxfixture',
  fixturesDir: '__jsxfixtures__',
  globalImports: [],
  hostname: null,
  hotReload: true,
  port: 5000,
  watchDirs: ['.']
};

export function getRootDir({ rootDir }: CosmosConfig): string {
  // TODO: Add support for --root-dir
  const currentDir = process.cwd();
  const projectDir =
    typeof argv.config === 'string'
      ? path.dirname(path.resolve(currentDir, argv.config))
      : currentDir;

  return rootDir ? path.resolve(projectDir, rootDir) : projectDir;
}

export function getPublicUrl({ publicUrl }: CosmosConfig) {
  return publicUrl || '/';
}

export function getExportPath(cosmosConfig: CosmosConfig) {
  const { exportPath } = cosmosConfig;
  const rootDir = getRootDir(cosmosConfig);
  return slash(path.resolve(rootDir, exportPath || 'cosmos-export'));
}

export function getPublicPath(cosmosConfig: CosmosConfig) {
  const { publicPath } = cosmosConfig;
  if (!publicPath) {
    return null;
  }

  const rootDir = getRootDir(cosmosConfig);
  return slash(path.resolve(rootDir, publicPath));
}

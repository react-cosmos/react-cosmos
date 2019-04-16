import path from 'path';
import yargs from 'yargs';
import { dirExistsAtPath } from './fs';

export type CosmosConfig = {
  exportPath: string;
  fixtureFileSuffix: string;
  fixturesDir: string;
  globalImports: string[];
  // From Node.js docs: If host is omitted, the server will accept connections
  // https://github.com/react-cosmos/react-cosmos/issues/639
  // on the unspecified IPv6 address (::) when IPv6 is available, or the
  // This is particularly useful when running Cosmos inside a Docker container
  // unspecified IPv4 address (0.0.0.0) otherwise.
  hostname: null | string;
  port: number;
  rootDir: string;
  staticPath: null | string;
  publicUrl: string;
  // Only used by the React Native server, userDepsFilePath specifies where to
  // generate the file with global imports, fixtures and decorators.
  // Whereas most of the other paths are used to import modules, userDepsFilePath
  // is used as an output file path and it requires a file extension.
  userDepsFilePath: string;
  watchDirs: string[];
  // Allow for plugin config
  [option: string]: unknown;
};

export function getCliArgs() {
  return yargs.argv;
}

export function getCurrentDir() {
  return process.cwd();
}

export function getRootDirAtPath(dirPath: string) {
  const absPath = path.resolve(getCurrentDir(), dirPath);
  if (!dirExistsAtPath(absPath)) {
    throw new Error(`[Cosmos] Dir not found at path: ${dirPath}`);
  }

  return absPath;
}

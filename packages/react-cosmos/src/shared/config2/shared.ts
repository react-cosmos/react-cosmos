import path from 'path';
import yargs from 'yargs';
import { dirExistsAtPath } from './fs';

export type RawCosmosConfig = {
  rootDir?: string;
  exportPath?: string;
  fixtureFileSuffix?: string;
  fixturesDir?: string;
  watchDirs?: string[];
  // Only used by the React Native server, userDepsFilePath specifies where to
  // generate the file with global imports, fixtures and decorators.
  // Whereas most of the other paths are used to import modules, userDepsFilePath
  // is used as an output file path and it requires a file extension.
  userDepsFilePath?: string;
  // Allow for plugin config
  [option: string]: any;
};

export function getCliArgs() {
  return yargs.argv;
}

export function getRootDirAtPath(dirPath: string) {
  const absPath = path.resolve(getCurrentDir(), dirPath);
  if (!dirExistsAtPath(absPath)) {
    throw new Error(`[Cosmos] Dir not found at path: ${dirPath}`);
  }

  return absPath;
}

export function getCurrentDir() {
  return process.cwd();
}

import path from 'path';
import yargs from 'yargs';
import { dirExistsAtPath } from './fs';

export type RawCosmosConfig = {
  rootDir?: string;
  exportPath?: string;
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

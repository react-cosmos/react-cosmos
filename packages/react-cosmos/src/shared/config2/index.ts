import path from 'path';
import yargs from 'yargs';
import { CosmosConfig } from './shared';
import { requireFileAtPath, fileExistsAtPath, dirExistsAtPath } from './fs';

export function getCosmosConfig(): CosmosConfig {
  return requireFileAtPath(getCosmosConfigPath()) || {};
}

export function getRootDir() {
  const currentDir = process.cwd();
  const cliArgs = getCliArgs();

  if (typeof cliArgs.rootDir === 'string') {
    const absPath = path.resolve(currentDir, cliArgs.rootDir);
    if (!dirExistsAtPath(absPath)) {
      throw new Error(`[Cosmos] Dir not found at path: ${cliArgs.rootDir}`);
    }

    return absPath;
  }

  const projectDir = path.dirname(getCosmosConfigPath());
  const cosmosConfig = getCosmosConfig();
  return cosmosConfig.rootDir
    ? path.resolve(projectDir, cosmosConfig.rootDir)
    : projectDir;
}

function getCosmosConfigPath() {
  const currentDir = process.cwd();
  const cliArgs = getCliArgs();

  // CLI suppport for --config relative/path/to/cosmos.config.json
  if (typeof cliArgs.config === 'string') {
    const absPath = path.resolve(currentDir, cliArgs.config);
    if (!fileExistsAtPath(absPath)) {
      throw new Error(`[Cosmos] Config not found at path: ${cliArgs.config}`);
    }

    // TODO: Throw if file is found but has extension other than .json
    return absPath;
  }

  // CLI suppport for --root-dir relative/path/project
  // TODO: Throw if cliArgs.rootDir exists and doesn't point to a dir
  const projectDir =
    typeof cliArgs.rootDir === 'string'
      ? path.resolve(currentDir, cliArgs.rootDir)
      : currentDir;
  return path.join(projectDir, 'cosmos.config.json');
}

function getCliArgs() {
  return yargs.argv;
}

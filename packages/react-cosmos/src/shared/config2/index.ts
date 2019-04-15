import path from 'path';
import yargs from 'yargs';
import { CosmosConfig } from './shared';
import { readCosmosConfigFile } from './readCosmosConfigFile';

export function getCosmosConfig(): CosmosConfig {
  return readCosmosConfigFile(getCosmosConfigPath()) || {};
}

export function getRootDir() {
  const currentDir = process.cwd();
  const cliArgs = getCliArgs();

  if (typeof cliArgs.rootDir === 'string') {
    // TODO: Throw if projectDir isn't a directory
    return path.resolve(currentDir, cliArgs.rootDir);
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
    // TODO: Throw if file isn't found at path
    // TODO: Throw if file is found but has extension other than .json
    return path.resolve(currentDir, cliArgs.config);
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

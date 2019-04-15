import path from 'path';
import yargs from 'yargs';
// import { slash } from '../slash';

export type CosmosConfig = {
  rootDir?: string;
};

export function getCosmosConfig(): CosmosConfig {
  const cosmosConfigPath = getCosmosConfigPath();
  // TODO: Enforce .json file extension
  return require(cosmosConfigPath);
}

export function getRootDir() {
  const currentDir = process.cwd();
  const cliArgs = getCliArgs();

  if (typeof cliArgs.rootDir === 'string') {
    // TODO: Throw if projectDir isn't a directory
    return path.resolve(currentDir, cliArgs.projectDir);
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
    // TODO: Add .json extension if missing
    return path.resolve(currentDir, cliArgs.config);
  }

  // CLI suppport for --root-dir relative/path/project
  // TODO: Throw if projectDir isn't a directory
  const projectDir =
    typeof cliArgs.rootDir === 'string'
      ? path.resolve(currentDir, cliArgs.rootDir)
      : currentDir;

  return path.join(projectDir, 'cosmos.config.json');
}

function getCliArgs() {
  return yargs.argv;
}

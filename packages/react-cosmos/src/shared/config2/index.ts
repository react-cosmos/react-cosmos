import path from 'path';
import yargs from 'yargs';
import { CosmosConfig } from './shared';
import { readCosmosConfigFile } from './readCosmosConfigFile';

export function getCosmosConfig(): CosmosConfig {
  const { /*explicit,*/ cosmosConfigPath } = getCosmosConfigPath();
  // TODO: Throw if "explicit" and cosmosConfigPath does not exist
  return readCosmosConfigFile(cosmosConfigPath) || {};
}

export function getRootDir() {
  const currentDir = process.cwd();
  const cliArgs = getCliArgs();

  if (typeof cliArgs.rootDir === 'string') {
    // TODO: Throw if projectDir isn't a directory
    return path.resolve(currentDir, cliArgs.rootDir);
  }

  const { cosmosConfigPath } = getCosmosConfigPath();
  const projectDir = path.dirname(cosmosConfigPath);
  const cosmosConfig = getCosmosConfig();
  return cosmosConfig.rootDir
    ? path.resolve(projectDir, cosmosConfig.rootDir)
    : projectDir;
}

function getCosmosConfigPath(): {
  explicit: boolean;
  cosmosConfigPath: string;
} {
  const currentDir = process.cwd();
  const cliArgs = getCliArgs();

  // CLI suppport for --config relative/path/to/cosmos.config.json
  if (typeof cliArgs.config === 'string') {
    // TODO: Throw if path has extension other than .json
    return {
      explicit: true,
      cosmosConfigPath: path.resolve(currentDir, cliArgs.config)
    };
  }

  // CLI suppport for --root-dir relative/path/project
  // TODO: Throw if projectDir isn't a directory
  const projectDir =
    typeof cliArgs.rootDir === 'string'
      ? path.resolve(currentDir, cliArgs.rootDir)
      : currentDir;

  return {
    explicit: false,
    cosmosConfigPath: path.join(projectDir, 'cosmos.config.json')
  };
}

function getCliArgs() {
  return yargs.argv;
}

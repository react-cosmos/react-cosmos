import path from 'path';
import { getCliArgs } from '../utils/cli';
import { dirExists, fileExists, moduleExists } from '../utils/fs';
import { createCosmosConfig } from './createCosmosConfig';
import { getCosmosConfigAtPath } from './getCosmosConfigAtPath';
import { getCurrentDir } from './shared';

export function detectCosmosConfig() {
  const cosmosConfigPath = detectCosmosConfigPath();
  return cosmosConfigPath
    ? getCosmosConfigAtPath(cosmosConfigPath)
    : createCosmosConfig(detectRootDir());
}

export function detectCosmosConfigPath() {
  const rootDir = detectRootDir();
  const cliArgs = getCliArgs();

  // CLI support for --config path/to/cosmos.config.json
  if (typeof cliArgs.config === 'string') {
    if (path.extname(cliArgs.config) !== '.json')
      throw new Error(
        `[Cosmos] Invalid config file type: ${cliArgs.config} (must be .json)`
      );

    const absPath = path.resolve(rootDir, cliArgs.config);
    if (!fileExists(absPath))
      throw new Error(`[Cosmos] Config not found at path: ${cliArgs.config}`);

    return absPath;
  }

  const defaultConfigPath = path.join(rootDir, 'cosmos.config.json');
  return moduleExists(defaultConfigPath) ? defaultConfigPath : null;
}

function detectRootDir() {
  const cliArgs = getCliArgs();

  // CLI support for --root-dir path/to/project
  if (typeof cliArgs.rootDir === 'string') {
    const absPath = path.resolve(getCurrentDir(), cliArgs.rootDir);
    if (!dirExists(absPath))
      throw new Error(`[Cosmos] Dir not found at path: ${cliArgs.rootDir}`);

    return absPath;
  }

  return getCurrentDir();
}

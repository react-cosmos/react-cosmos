import path from 'path';
import { getCliArgs, getCurrentDir, getRootDirAtPath } from './shared';
import { fileExistsAtPath } from './fs';

export function getCosmosConfigPath() {
  const cliArgs = getCliArgs();

  // CLI suppport for --config relative/path/to/cosmos.config.json
  if (typeof cliArgs.config === 'string') {
    if (path.extname(cliArgs.config) !== '.json') {
      throw new Error(
        `[Cosmos] Invalid config file type: ${cliArgs.config} (must be .json)`
      );
    }

    const absPath = path.resolve(getCurrentDir(), cliArgs.config);
    if (!fileExistsAtPath(absPath)) {
      throw new Error(`[Cosmos] Config not found at path: ${cliArgs.config}`);
    }

    return absPath;
  }

  // CLI suppport for --root-dir relative/path/project
  const configDir =
    typeof cliArgs.rootDir === 'string'
      ? getRootDirAtPath(cliArgs.rootDir)
      : getCurrentDir();
  return path.join(configDir, 'cosmos.config.json');
}

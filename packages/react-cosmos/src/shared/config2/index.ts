import { slash } from '../slash';
import path from 'path';
import {
  CosmosConfig,
  getCosmosConfigPath,
  getRootDirAtPath,
  getCliArgs
} from './shared';
import { requireFileAtPath } from './fs';

const DEFAULT_EXPORT_PATH = 'cosmos-export';

export function getCosmosConfig(): CosmosConfig {
  return requireFileAtPath(getCosmosConfigPath()) || {};
}

export function getRootDir() {
  const cliArgs = getCliArgs();
  if (typeof cliArgs.rootDir === 'string') {
    return getRootDirAtPath(cliArgs.rootDir);
  }

  const configDir = path.dirname(getCosmosConfigPath());
  const cosmosConfig = getCosmosConfig();
  return cosmosConfig.rootDir
    ? path.resolve(configDir, cosmosConfig.rootDir)
    : configDir;
}

export function getExportPath() {
  const cosmosConfig = getCosmosConfig();
  const relExportPath = cosmosConfig.exportPath || DEFAULT_EXPORT_PATH;
  return slash(path.resolve(getRootDir(), relExportPath));
}

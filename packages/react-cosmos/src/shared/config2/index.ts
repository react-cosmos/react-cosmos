import { slash } from '../slash';
import path from 'path';
import { RawCosmosConfig, getCliArgs, getRootDirAtPath } from './shared';
import { requireFileAtPath } from './fs';
import { BaseCosmosConfig } from './BaseCosmosConfig';
import { getCosmosConfigPath } from './cosmosConfigPath';

export function getCosmosConfig(): CosmosConfig {
  const rawCosmosConfig = requireFileAtPath(getCosmosConfigPath()) || {};
  return new CosmosConfig(rawCosmosConfig);
}

export class CosmosConfig extends BaseCosmosConfig<RawCosmosConfig> {
  getRootDir() {
    const cliArgs = getCliArgs();
    if (typeof cliArgs.rootDir === 'string') {
      return getRootDirAtPath(cliArgs.rootDir);
    }

    const configDir = path.dirname(getCosmosConfigPath());
    const { rootDir } = this.getRawConfig();
    return rootDir ? path.resolve(configDir, rootDir) : configDir;
  }

  getExportPath() {
    const { exportPath } = this.getRawConfig();
    const relExportPath = this.getDefault<string>(exportPath, 'cosmos-export');
    return slash(path.resolve(this.getRootDir(), relExportPath));
  }
}

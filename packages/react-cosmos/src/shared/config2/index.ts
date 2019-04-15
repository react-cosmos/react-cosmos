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

  getFixtureFileSuffix() {
    const { fixtureFileSuffix } = this.getRawConfig();
    return this.getDefault<string>(fixtureFileSuffix, 'fixture');
  }

  getFixturesDir() {
    const { fixturesDir } = this.getRawConfig();
    return this.getDefault<string>(fixturesDir, '__fixtures__');
  }

  getWatchDirs() {
    const { watchDirs } = this.getRawConfig();
    const dirs = this.getDefault<string[]>(watchDirs, ['.']);
    const rootDir = this.getRootDir();
    return dirs.map(dirPath => slash(path.resolve(rootDir, dirPath)));
  }

  getUserDepsFilePath() {
    const { userDepsFilePath } = this.getRawConfig();
    return slash(
      path.resolve(
        this.getRootDir(),
        this.getDefault<string>(userDepsFilePath, 'cosmos.userdeps.js')
      )
    );
  }

  getHostname() {
    const { hostname } = this.getRawConfig();
    return this.getDefault<null | string>(hostname, null);
  }

  getPort() {
    const cliArgs = getCliArgs();
    if (typeof cliArgs.port === 'number') {
      return cliArgs.port;
    }

    const { port } = this.getRawConfig();
    return this.getDefault<number>(port, 5000);
  }
}

import path from 'path';
import resolveFrom from 'resolve-from';
import { slash } from '../slash';
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
    const relExportPath = this.default<string>(exportPath, 'cosmos-export');
    return this.resolvePath(relExportPath);
  }

  getFixtureFileSuffix() {
    const rawConfig = this.getRawConfig();
    return this.default<string>(rawConfig.fixtureFileSuffix, 'fixture');
  }

  getFixturesDir() {
    const rawConfig = this.getRawConfig();
    return this.default<string>(rawConfig.fixturesDir, '__fixtures__');
  }

  getWatchDirs() {
    const rawConfig = this.getRawConfig();
    const watchDirs = this.default<string[]>(rawConfig.watchDirs, ['.']);
    return watchDirs.map(watchDir => this.resolvePath(watchDir));
  }

  getUserDepsFilePath() {
    const { userDepsFilePath } = this.getRawConfig();
    return this.resolvePath(
      this.default<string>(userDepsFilePath, 'cosmos.userdeps.js')
    );
  }

  getHostname() {
    const { hostname } = this.getRawConfig();
    return this.default<null | string>(hostname, null);
  }

  getPort() {
    const cliArgs = getCliArgs();
    if (typeof cliArgs.port === 'number') {
      return cliArgs.port;
    }

    const { port } = this.getRawConfig();
    return this.default<number>(port, 5000);
  }

  getGlobalImports() {
    const rawConfig = this.getRawConfig();
    const globalImports = this.default<string[]>(rawConfig.globalImports, []);
    return globalImports.map(importPath => this.resolveModule(importPath));
  }

  protected resolvePath(filePath: string) {
    // Use when dealing strictly with file paths
    return slash(path.resolve(this.getRootDir(), filePath));
  }

  protected resolveModule(moduleId: string) {
    // Use when dealing with file paths and module names interchangeably
    return resolveModule(this.getRootDir(), moduleId);
  }
}

function resolveModule(rootDir: string, moduleId: string) {
  return slash(
    // An absolute path is already resolved
    path.isAbsolute(moduleId)
      ? moduleId
      : resolveFrom.silent(rootDir, moduleId) ||
          // Final attempt: Resolve relative paths that don't either
          // 1. Don't start with ./
          // 2. Don't point to an existing file
          path.join(rootDir, moduleId)
  );
}

import path from 'path';
import resolveFrom from 'resolve-from';
import { slash } from '../shared/slash';
import { RawCosmosConfig, getCliArgs, getRootDirAtPath } from './shared';
import { requireFileAtPath } from './fs';
import { BaseCosmosConfig } from './BaseCosmosConfig';
import { getCosmosConfigPath } from './cosmosConfigPath';

export { RawCosmosConfig } from './shared';

export function getCosmosConfig<Config extends CosmosConfig>() {
  const rawCosmosConfig = requireFileAtPath(getCosmosConfigPath()) || {};
  return new CosmosConfig(rawCosmosConfig) as Config;
}

export class CosmosConfig<
  RawConfig extends RawCosmosConfig = RawCosmosConfig
> extends BaseCosmosConfig<RawConfig> {
  get rootDir() {
    const cliArgs = getCliArgs();
    if (typeof cliArgs.rootDir === 'string') {
      return getRootDirAtPath(cliArgs.rootDir);
    }

    const configDir = path.dirname(getCosmosConfigPath());
    const { rootDir } = this.getRawConfig();
    return rootDir ? path.resolve(configDir, rootDir) : configDir;
  }

  get exportPath() {
    const { exportPath } = this.getRawConfig();
    const relExportPath = this.default<string>(exportPath, 'cosmos-export');
    return this.resolvePath(relExportPath);
  }

  get staticPath() {
    const { staticPath } = this.getRawConfig();
    const relStaticPath = this.default<null | string>(staticPath, null);
    return relStaticPath && this.resolvePath(relStaticPath);
  }

  get publicUrl() {
    const { publicUrl } = this.getRawConfig();
    return this.default<string>(publicUrl, '/');
  }

  get fixtureFileSuffix() {
    const rawConfig = this.getRawConfig();
    return this.default<string>(rawConfig.fixtureFileSuffix, 'fixture');
  }

  get fixturesDir() {
    const rawConfig = this.getRawConfig();
    return this.default<string>(rawConfig.fixturesDir, '__fixtures__');
  }

  get watchDirs() {
    const rawConfig = this.getRawConfig();
    const watchDirs = this.default<string[]>(rawConfig.watchDirs, ['.']);
    return watchDirs.map(watchDir => this.resolvePath(watchDir));
  }

  get userDepsFilePath() {
    const { userDepsFilePath } = this.getRawConfig();
    return this.resolvePath(
      this.default<string>(userDepsFilePath, 'cosmos.userdeps.js')
    );
  }

  get hostname() {
    const { hostname } = this.getRawConfig();
    return this.default<null | string>(hostname, null);
  }

  get port() {
    const cliArgs = getCliArgs();
    if (typeof cliArgs.port === 'number') {
      return cliArgs.port;
    }

    const { port } = this.getRawConfig();
    return this.default<number>(port, 5000);
  }

  get globalImports() {
    const rawConfig = this.getRawConfig();
    const globalImports = this.default<string[]>(rawConfig.globalImports, []);
    return globalImports.map(importPath => this.resolveModule(importPath));
  }

  protected resolvePath(filePath: string) {
    // Use when dealing strictly with file paths
    return slash(path.resolve(this.rootDir, filePath));
  }

  protected resolveModule(moduleId: string) {
    // Use when dealing with file paths and module names interchangeably
    return resolveModule(this.rootDir, moduleId);
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

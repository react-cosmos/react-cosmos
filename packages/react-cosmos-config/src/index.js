import path from 'path';
import slash from 'slash';
import resolveFrom from 'resolve-from';
import importModule from 'react-cosmos-utils/lib/import-module';

const resolveUserPath = (userPath, rootPath) =>
  slash(path.isAbsolute(userPath) ? userPath : (
    resolveFrom.silent(rootPath, userPath) || path.join(rootPath, userPath)
  ));

const defaults = {
  componentPaths: [],
  fixturePaths: [],
  fixturesDir: '__fixtures__',
  globalImports: [],
  hostname: 'localhost',
  hot: true,
  ignore: [],
  port: 8989,
  proxies: [],
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export',
};

const PATHS = ['componentPaths', 'fixturePaths', 'globalImports', 'proxies'];
const PATH = ['publicPath', 'webpackConfigPath', 'outputPath'];

export default function getCosmosConfig(configPath = 'cosmos.config') {
  const normalizedConfigPath = resolveUserPath(configPath, process.cwd());
  const userConfig = importModule(require(normalizedConfigPath));
  const rootPath = path.dirname(normalizedConfigPath);

  const config = {
    ...defaults,
    ...userConfig,
  };
  const resolvedConfig = Object.keys(config).reduce((result, key) => {
    if (PATHS.indexOf(key) > -1) {
      result[key] = config[key].map(path => resolveUserPath(path, rootPath));
    } else if (PATH.indexOf(key) > -1) {
      result[key] = resolveUserPath(config[key], rootPath);
    } else {
      result[key] = config[key];
    }

    return result;
  }, {});

  return resolvedConfig;
}

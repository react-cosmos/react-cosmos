import path from 'path';
import importModule from 'react-cosmos-utils/lib/import-module';
import resolveUserPath from 'react-cosmos-utils/lib/resolve-user-path';

const defaults = {
  componentPaths: [],
  fixturePaths: [],
  fixturesDir: '__fixtures__',
  globalImports: [],
  hostname: 'localhost',
  hot: true,
  ignore: [],
  port: 8989,
  proxiesPath: 'cosmos.proxies',
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export',
  publicUrl: '/loader/'
};

const PATHS = ['componentPaths', 'fixturePaths', 'globalImports'];
const PATH = ['proxiesPath', 'publicPath', 'webpackConfigPath', 'outputPath'];

export default function getCosmosConfig(cosmosConfigPath) {
  const userConfig = importModule(require(cosmosConfigPath));
  const rootPath = path.dirname(cosmosConfigPath);

  const config = {
    ...defaults,
    ...userConfig
  };
  const resolvedConfig = Object.keys(config).reduce((result, key) => {
    if (PATHS.indexOf(key) > -1) {
      result[key] = config[key].map(path => resolveUserPath(rootPath, path));
    } else if (PATH.indexOf(key) > -1) {
      result[key] = resolveUserPath(rootPath, config[key]);
    } else {
      result[key] = config[key];
    }

    return result;
  }, {});

  return resolvedConfig;
}

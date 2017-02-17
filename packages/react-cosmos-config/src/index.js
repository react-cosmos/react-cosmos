import path from 'path';
import resolveFrom from 'resolve-from';
import importModule from 'react-cosmos-utils/lib/import-module';

const resolveUserPath = (userPath, rootPath) =>
  path.isAbsolute(userPath) ? userPath : (
    resolveFrom(rootPath, userPath) || path.join(rootPath, userPath)
  );

const defaults = {
  componentPaths: [],
  fixturePaths: [],
  globalImports: [],
  hmrPlugin: true,
  hostname: 'localhost',
  hot: true,
  ignore: [],
  port: 8989,
  proxies: [],
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export'
};

export default function getCosmosConfig(configPath = 'cosmos.config') {
  const normalizedConfigPath = resolveUserPath(configPath, process.cwd());
  defaults.outputPath = path.join(path.dirname(normalizedConfigPath), 'dist');
  const userConfig = importModule(require(normalizedConfigPath));
  const rootPath = path.dirname(normalizedConfigPath);

  const config = {
    ...defaults,
    ...userConfig,
  };
  const resolvedConfig = Object.keys(config).reduce((result, key) => {
    if (['componentPaths', 'fixturePaths', 'globalImports', 'proxies'].includes(key)) {
      result[key] = config[key].map(path => resolveUserPath(path, rootPath));
    } else if (['publicPath', 'webpackConfigPath', 'outputPath'].includes(key)) {
      result[key] = resolveUserPath(config[key], rootPath);
    } else {
      result[key] = config[key];
    }

    return result;
  }, {});

  return resolvedConfig;
}

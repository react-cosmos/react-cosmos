// @flow

type ExcludePattern = string | RegExp;

export type ExcludePatterns = ExcludePattern | Array<ExcludePattern>;

type WebpackConfig = Object;
type WebpackConfigOverride = (WebpackConfig, { env: string }) => WebpackConfig;

export type PluginConfig = { [prop: string]: mixed };

export type Config = {
  next: boolean,
  rootPath: string,
  fileMatch: Array<string>,
  fileMatchIgnore: string,
  exclude: ExcludePatterns,
  globalImports: Array<string>,
  hostname: ?string,
  hot: boolean,
  port: number,
  proxiesPath: string,
  webpackConfigPath: string,
  webpack?: WebpackConfigOverride,
  outputPath: string,
  publicPath?: string,
  publicUrl: string,
  containerQuerySelector?: string,
  httpProxy?: {| context: string, target: string |},
  watchDirs: Array<string>,
  modulesPath: string,
  plugin: PluginConfig,
  // Deprecated
  proxies?: Array<string>,
  componentPaths: Array<string>,
  ignore: Array<RegExp>,
  fixturesDir: string,
  fixturePaths: Array<string>
};

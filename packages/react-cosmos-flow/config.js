// @flow

type ExcludePattern = string | RegExp;

export type ExcludePatterns = ExcludePattern | Array<ExcludePattern>;

type WebpackConfig = Object;
type WebpackConfigOverride = (WebpackConfig, { env: string }) => WebpackConfig;

export type Config = {
  rootPath: string,
  fileMatch: Array<string>,
  exclude: ExcludePatterns,
  globalImports: Array<string>,
  hostname: string,
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
  // Deprecated
  componentPaths: Array<string>,
  ignore: Array<RegExp>,
  fixturesDir: string,
  fixturePaths: Array<string>
};

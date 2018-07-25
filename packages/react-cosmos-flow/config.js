// @flow

type ExcludePattern = string | RegExp;

export type ExcludePatterns = ExcludePattern | Array<ExcludePattern>;

type WebpackConfig = Object;
type WebpackConfigOverride = (WebpackConfig, { env: string }) => WebpackConfig;

export type ResponsiveDevices = Array<{|
  label: string,
  width: number,
  height: number
|}>;

export type Config = {
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
  responsiveDevices: ResponsiveDevices,
  httpProxy?: {| context: string, target: string |},
  watchDirs: Array<string>,
  modulesPath: string,
  // Deprecated
  proxies?: Array<string>,
  componentPaths: Array<string>,
  ignore: Array<RegExp>,
  fixturesDir: string,
  fixturePaths: Array<string>
};

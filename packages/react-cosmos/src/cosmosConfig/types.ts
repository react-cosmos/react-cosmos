import { CosmosRendererUrl } from 'react-cosmos-core';

interface HttpsOptions {
  keyPath: string;
  certPath: string;
}

export type CosmosDomConfig = {
  containerQuerySelector: null | string;
};

export type CosmosConfig = {
  exportPath: string;
  detectLocalPlugins: boolean;
  disablePlugins: boolean;
  dom: CosmosDomConfig;
  // Used with React Native and in custom integrations, exposeImports specifies
  // whether (and where when passed a string) to generate a file that exposes
  // the user imports and config required for the Cosmos renderer (fixtures,
  // decorators, etc.) When a path is specified it requires a file extension.
  exposeImports: boolean | string;
  fixtureFileSuffix: string;
  fixturesDir: string;
  globalImports: string[];
  // From Node.js docs: If host is omitted, the server will accept connections
  // https://github.com/react-cosmos/react-cosmos/issues/639
  // on the unspecified IPv6 address (::) when IPv6 is available, or the
  // This is particularly useful when running Cosmos inside a Docker container
  // unspecified IPv4 address (0.0.0.0) otherwise.
  host: null | string;
  https: boolean;
  httpsOptions: null | HttpsOptions;
  ignore: string[];
  lazy: boolean;
  port: number;
  portRetries: number;
  plugins: string[];
  publicUrl: string;
  rendererUrl: CosmosRendererUrl;
  rootDir: string;
  staticPath: null | string;
  watchDirs: string[];
  // Plugin configs
  [option: string]: unknown;
  // UI plugin configs
  ui: {
    [pluginName: string]: {};
  };
};

export type CosmosDomConfigInput = Partial<CosmosDomConfig>;
export type CosmosConfigInput = Partial<
  CosmosConfig & {
    // Deprecated
    hostname: null | string;
  }
>;

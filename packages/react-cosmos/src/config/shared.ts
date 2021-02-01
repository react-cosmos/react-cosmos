import { requireModule } from '../shared/fs';

interface HttpsOptions {
  keyPath: string;
  certPath: string;
}

export type CosmosConfig = {
  exportPath: string;
  disablePlugins: boolean;
  fixtureFileSuffix: string;
  fixturesDir: string;
  globalImports: string[];
  // From Node.js docs: If host is omitted, the server will accept connections
  // https://github.com/react-cosmos/react-cosmos/issues/639
  // on the unspecified IPv6 address (::) when IPv6 is available, or the
  // This is particularly useful when running Cosmos inside a Docker container
  // unspecified IPv4 address (0.0.0.0) otherwise.
  hostname: null | string;
  https: boolean;
  httpsOptions: null | HttpsOptions;
  port: number;
  publicUrl: string;
  outputFilename: string;
  rootDir: string;
  staticPath: null | string;
  // Only used by the React Native server, userDepsFilePath specifies where to
  // generate the file with global imports, fixtures and decorators.
  // Whereas most of the other paths are used to import modules, userDepsFilePath
  // is used as an output file path and it requires a file extension.
  userDepsFilePath: string;
  watchDirs: string[];
  // Plugin configs
  [option: string]: unknown;
  // UI plugin configs
  ui: {
    [pluginName: string]: {};
  };
};

export type CosmosConfigInput = Partial<CosmosConfig>;

export function getCurrentDir() {
  return process.cwd();
}

export function requireConfigFile(cosmosConfigPath: string): CosmosConfigInput {
  return requireModule(cosmosConfigPath);
}

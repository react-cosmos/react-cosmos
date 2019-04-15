export {
  // @ts-ignore
  __mock as mockCosmosConfigFile,
  // @ts-ignore
  __unmock as unmockCosmosConfigFile
} from '../readCosmosConfigFile';

jest.mock('../readCosmosConfigFile', () => {
  let configMocks: { [path: string]: {} } = {};
  return {
    readCosmosConfigFile: (cosmosConfigPath: string) =>
      configMocks[cosmosConfigPath] || null,

    cosmosConfigFileExists: (cosmosConfigPath: string) =>
      configMocks.hasOwnProperty(cosmosConfigPath),

    __mock: (cosmosConfigPath: string, cosmosConfig: {}) => {
      configMocks = { [cosmosConfigPath]: cosmosConfig };
    },

    __unmock: () => {
      configMocks = {};
    }
  };
});

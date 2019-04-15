export {
  // @ts-ignore
  __mock as mockCosmosConfigFile,
  // @ts-ignore
  __unmock as unmockCosmosConfigFile
} from '../readCosmosConfigFile';

jest.mock('../readCosmosConfigFile', () => {
  let cosmosConfigsPerPath: { [path: string]: {} } = {};
  const readCosmosConfigFile = jest.fn(
    (cosmosConfigPath: string) => cosmosConfigsPerPath[cosmosConfigPath]
  );
  return {
    readCosmosConfigFile,
    __mock: (cosmosConfigPath: string, cosmosConfig: {}) => {
      cosmosConfigsPerPath = { [cosmosConfigPath]: cosmosConfig };
    },
    __unmock: () => {
      cosmosConfigsPerPath = {};
    }
  };
});

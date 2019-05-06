import path from 'path';
import { CosmosConfig } from '../config';
// @ts-ignore
import { __mockFile, __mockDir, __unmockFs } from '../shared/fs';
import { getCwdPath } from './cwd';

jest.mock('../shared/fs', () => {
  let fileMocks: { [path: string]: any } = {};
  let dirMocks: string[] = [];

  function requireModule(filePath: string) {
    return fileMocks[filePath] || fileMocks[`${filePath}.js`];
  }

  function moduleExists(filePath: string) {
    return (
      fileMocks.hasOwnProperty(filePath) ||
      fileMocks.hasOwnProperty(`${filePath}.js`)
    );
  }

  function fileExists(filePath: string) {
    return fileMocks.hasOwnProperty(filePath);
  }

  function dirExists(dirPath: string) {
    return dirMocks.indexOf(dirPath) !== -1;
  }

  return {
    requireModule,
    moduleExists,
    fileExists,
    dirExists,

    __mockFile(filePath: string, fileMock: any) {
      fileMocks = { ...fileMocks, [filePath]: fileMock };
    },

    __mockDir(dirPath: string) {
      dirMocks = [...dirMocks, dirPath];
    },

    __unmockFs() {
      fileMocks = {};
      dirMocks = [];
    }
  };
});

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: Partial<CosmosConfig>
) {
  mockFile(cosmosConfigPath, cosmosConfig);
}

export function mockFile(filePath: string, fileContent: {}) {
  const absPath = getCwdPath(filePath);
  __mockFile(absPath, fileContent);
  __mockDir(path.dirname(absPath));
}

export function mockDir(dirPath: string) {
  __mockDir(getCwdPath(dirPath));
}

export function unmockFs() {
  __unmockFs();
}

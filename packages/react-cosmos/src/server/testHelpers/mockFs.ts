import path from 'path';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getCwdPath } from './cwd.js';

jest.mock('../utils/fs', () => {
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
    },
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
  requireMocked().__mockFile(absPath, fileContent);
  requireMocked().__mockDir(path.dirname(absPath));
}

export function mockDir(dirPath: string) {
  requireMocked().__mockDir(getCwdPath(dirPath));
}

export function unmockFs() {
  requireMocked().__unmockFs();
}

function requireMocked() {
  return require('../utils/fs.js');
}

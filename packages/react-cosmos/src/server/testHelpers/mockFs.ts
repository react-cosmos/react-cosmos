import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getCwdPath } from './cwd.js';

jest.mock('../utils/fs', () => {
  const actual = jest.requireActual('../utils/fs');
  let mocked = false;

  let fileMocks: { [path: string]: {} } = {};
  let dirMocks: string[] = [];

  async function importJson(filePath: string) {
    if (!mocked) return actual.importJson(filePath);

    if (!fileMocks.hasOwnProperty(filePath)) {
      throw new Error(`Cannot find JSON '${filePath}'`);
    }

    return fileMocks[filePath];
  }

  async function importModule(moduleId: string) {
    if (!mocked) return actual.importModule(moduleId);

    if (
      !fileMocks.hasOwnProperty(moduleId) &&
      !fileMocks.hasOwnProperty(`${moduleId}.js`)
    ) {
      throw new Error(`Cannot find module '${moduleId}'`);
    }

    return fileMocks[moduleId] || fileMocks[`${moduleId}.js`];
  }

  function moduleExists(moduleId: string) {
    if (!mocked) return actual.moduleExists(moduleId);

    return (
      fileMocks.hasOwnProperty(moduleId) ||
      fileMocks.hasOwnProperty(`${moduleId}.js`)
    );
  }

  function fileExists(filePath: string) {
    if (!mocked) return actual.fileExists(filePath);

    return fileMocks.hasOwnProperty(filePath);
  }

  function dirExists(dirPath: string) {
    if (!mocked) return actual.dirExists(dirPath);

    return dirMocks.indexOf(dirPath) !== -1;
  }

  return {
    importJson,
    importModule,
    moduleExists,
    fileExists,
    dirExists,

    __mockJson(filePath: string, jsonMock: {}) {
      mocked = true;
      fileMocks = { ...fileMocks, [filePath]: jsonMock };
    },

    __mockFile(filePath: string, fileMock: {}) {
      mocked = true;
      fileMocks = { ...fileMocks, [filePath]: fileMock };
    },

    __mockDir(dirPath: string) {
      mocked = true;
      dirMocks = [...dirMocks, dirPath];
    },

    __resetMock() {
      fileMocks = {};
      dirMocks = [];
    },
  };
});

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: Partial<CosmosConfig>
) {
  const absPath = getCwdPath(cosmosConfigPath);
  requireMocked().__mockFile(absPath, cosmosConfig);
  requireMocked().__mockDir(path.dirname(absPath));
}

// TODO: Combine mockFileUrl with mockFileUrl

export function mockFileUrl(filePath: string, fileContent: {}) {
  const fileUrl = pathToFileURL(filePath);
  requireMocked().__mockFile(fileUrl, { default: fileContent });
}

export function mockFile(filePath: string, fileContent: {}) {
  const absPath = getCwdPath(filePath);
  requireMocked().__mockFile(absPath, { default: fileContent });
  requireMocked().__mockDir(path.dirname(absPath));
}

export function mockDir(dirPath: string) {
  requireMocked().__mockDir(getCwdPath(dirPath));
}

export function resetFsMock() {
  requireMocked().__resetMock();
}

function requireMocked() {
  return require('../utils/fs.js');
}

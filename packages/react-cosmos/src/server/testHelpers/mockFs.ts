import path from 'node:path';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getCwdPath } from './cwd.js';

jest.mock('../utils/fs', () => {
  const actual = jest.requireActual('../utils/fs');
  let mocked = false;

  let fileMocks: { [path: string]: {} } = {};
  let dirMocks: string[] = [];

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

  async function importJson(filePath: string) {
    if (!mocked) return actual.importJson(filePath);

    if (!fileMocks.hasOwnProperty(filePath)) {
      throw new Error(`Cannot find JSON '${filePath}'`);
    }

    return fileMocks[filePath];
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
    importModule,
    importJson,
    moduleExists,
    fileExists,
    dirExists,

    __mockFile(filePath: string, fileMock: {}) {
      mocked = true;
      fileMocks = { ...fileMocks, [filePath]: fileMock };
    },

    __mockJson(filePath: string, jsonMock: {}) {
      mocked = true;
      fileMocks = { ...fileMocks, [filePath]: jsonMock };
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

export function mockFile(filePath: string, fileMock: {}) {
  requireMocked().__mockFile(filePath, fileMock);
  requireMocked().__mockDir(path.dirname(filePath));
}

export function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: Partial<CosmosConfig>
) {
  const absPath = getCwdPath(cosmosConfigPath);
  mockFile(absPath, cosmosConfig);
}

export function mockCwdModuleDefault(filePath: string, fileMock: {}) {
  const absPath = getCwdPath(filePath);
  mockFile(absPath, { default: fileMock });
}

export function resetFsMock() {
  requireMocked().__resetMock();
}

function requireMocked() {
  return require('../utils/fs.js');
}

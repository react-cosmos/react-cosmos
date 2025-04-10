import path from 'node:path';
import { vi } from 'vitest';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getCwdPath } from './cwd.js';

type ActualApi = typeof import('../utils/fs');

type MockApi = ActualApi & {
  __mockFile: (filePath: string, fileMock: {}) => void;
  __mockJson: (filePath: string, jsonMock: {}) => void;
  __mockDir: (dirPath: string) => void;
  __resetMock: () => void;
};

vi.mock('../utils/fs', async () => {
  const actual = (await vi.importActual('../utils/fs')) as ActualApi;
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

export async function mockFile(filePath: string, fileMock: {}) {
  (await importMocked()).__mockFile(filePath, fileMock);
  (await importMocked()).__mockDir(path.dirname(filePath));
}

export async function mockCosmosConfig(
  configPath: string,
  config: Partial<CosmosConfig>
) {
  const absPath = getCwdPath(configPath);
  await mockFile(absPath, config);
}

export async function mockCwdModuleDefault(filePath: string, fileMock: {}) {
  const absPath = getCwdPath(filePath);
  await mockFile(absPath, { default: fileMock });
}

export async function resetFsMock() {
  (await importMocked()).__resetMock();
}

async function importMocked() {
  return import('../utils/fs.js') as Promise<MockApi>;
}

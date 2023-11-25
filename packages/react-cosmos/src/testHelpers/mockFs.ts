import path from 'node:path';
import { vi } from 'vitest';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getCwdPath } from './cwd.js';

vi.mock('../utils/fs', async () => {
  const actual = (await vi.importActual('../utils/fs')) as any; // TODO: FIXME
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
  // @ts-ignore FIXME
  (await importMocked()).__mockFile(filePath, fileMock);
  // @ts-ignore FIXME
  (await importMocked()).__mockDir(path.dirname(filePath));
}

export async function mockCosmosConfig(
  cosmosConfigPath: string,
  cosmosConfig: Partial<CosmosConfig>
) {
  const absPath = getCwdPath(cosmosConfigPath);
  await mockFile(absPath, cosmosConfig);
}

export async function mockCwdModuleDefault(filePath: string, fileMock: {}) {
  const absPath = getCwdPath(filePath);
  await mockFile(absPath, { default: fileMock });
}

export async function resetFsMock() {
  // @ts-ignore FIXME
  (await importMocked()).__resetMock();
}

async function importMocked() {
  return import('../utils/fs.js');
}

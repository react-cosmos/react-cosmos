// NOTE: This API has been extracted to easily mock the file system in tests

import fs from 'fs';
import { requireModule } from './requireModule.js';
import { resolve } from './resolve.js';

export async function importModule<T>(moduleId: string): Promise<T> {
  return moduleId.endsWith('.json')
    ? requireModule(moduleId)
    : getDefaultExport(await import(moduleId));
}

// Better than fs.exists because it works for module paths without an extension
export function moduleExists(moduleId: string) {
  try {
    return resolve(moduleId) && true;
  } catch (err) {
    return false;
  }
}

export function fileExists(filePath: string) {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
}

export function dirExists(dirPath: string) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

// Get "default" export from either an ES or CJS module
// More context: https://github.com/react-cosmos/react-cosmos/issues/895
function getDefaultExport<T extends object>(module: T | { default: T }): T {
  if (typeof module === 'object' && 'default' in module) {
    return module.default;
  }

  return module;
}

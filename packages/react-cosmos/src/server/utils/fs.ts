// NOTE: This API has been extracted to easily mock the file system in tests

import fs from 'fs';
import { requireModule } from './requireModule.js';
import { resolve } from './resolve.js';

export async function importJson<T>(moduleId: string): Promise<T> {
  return requireModule(moduleId);
}

export async function importModule<T>(moduleId: string): Promise<T> {
  return import(moduleId);
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

// NOTE: This API has been extracted to easily mock the file system in tests

import fs from 'node:fs';
import url from 'node:url';
import { requireModule } from './requireModule.js';
import { resolve } from './resolve.js';

export async function importModule<T>(filePath: string): Promise<T> {
  const fileUrl = url.pathToFileURL(filePath).href;
  return import(fileUrl);
}

export async function importJson<T>(filePath: string): Promise<T> {
  return requireModule(filePath);
}

// Better than fs.exists because it works for module paths without an extension
export function moduleExists(moduleId: string) {
  try {
    resolve(moduleId);
    return true;
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

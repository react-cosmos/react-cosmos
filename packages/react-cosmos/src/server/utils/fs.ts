// NOTE: This API has been extracted to be easily mocked inside tests
import fs from 'fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export function requireModule(modulePath: string) {
  // This purpose of this wrapper is merely to make it easy to mock user
  // modules in tests
  return require(modulePath);
}

// Better than fs.exists because it works for module paths without an extension
export function moduleExists(modulePath: string) {
  try {
    return require.resolve(modulePath) && true;
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

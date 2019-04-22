// NOTE: This API has been extracted to be easily mocked inside tests
import fs from 'fs';

export function requireModule(modulePath: string) {
  try {
    return require(modulePath);
  } catch (err) {
    return undefined;
  }
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

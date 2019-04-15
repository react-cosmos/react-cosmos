// NOTE: This API has been extracted to be easily mocked inside tests
import fs from 'fs';

export function requireFileAtPath(modulePath: string) {
  try {
    return require(modulePath);
  } catch (err) {
    return undefined;
  }
}

export function fileExistsAtPath(filePath: string) {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
}

export function dirExistsAtPath(dirPath: string) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
}

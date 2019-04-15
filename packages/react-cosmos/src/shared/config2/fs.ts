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
  if (!fs.existsSync(filePath)) {
    return false;
  }

  return fs.lstatSync(filePath).isFile();
}

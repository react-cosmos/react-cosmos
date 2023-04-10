import path from 'path';

export function getCwdPath(relPath = '.') {
  return path.resolve(process.cwd(), relPath);
}

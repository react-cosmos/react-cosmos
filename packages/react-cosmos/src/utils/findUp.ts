import fs from 'node:fs/promises';
import path from 'node:path';

// Code inspired from https://github.com/sindresorhus/find-up-simple/
export async function findUp(fileName: string, fromDir: string) {
  const { root: rootDir } = path.parse(fromDir);

  let currentDir = fromDir;

  while (currentDir && currentDir !== rootDir) {
    const filePath = path.join(currentDir, fileName);

    try {
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        return filePath;
      }
    } catch {}

    currentDir = path.dirname(currentDir);
  }

  return null;
}

import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureFile(atPath: string) {
  try {
    await fs.mkdir(path.dirname(atPath), { recursive: true });
    await fs.writeFile(atPath, '', { flag: 'wx' });
  } catch (err: any) {
    // Nothing to do if file already exists
    if (err.code !== 'EEXIST') throw err;
  }
}

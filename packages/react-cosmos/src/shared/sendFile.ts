import path from 'node:path';
import type { Response } from 'express';

// Express 5 (send >= 1) responds with 404 when any segment of the served path
// is a dotfile, and package managers like pnpm resolve modules inside a .pnpm
// directory. Sending the file name relative to its own directory keeps the
// dotfile check scoped to the file itself, which is what we serve anyway.
export function sendFile(res: Response, filePath: string) {
  res.sendFile(path.basename(filePath), { root: path.dirname(filePath) });
}

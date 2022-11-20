import path from 'path';
import { resolveFromSilent } from './resolveFromSilent.js';

export function resolveLoose(fromDirectory: string, moduleId: string) {
  // Use to deal with file paths and module names interchangeably.
  return path.isAbsolute(moduleId)
    ? moduleId
    : resolveFromSilent(fromDirectory, moduleId) ||
        // Final attempt: Resolve relative paths that don't either
        // 1. Don't start with ./
        // 2. Don't point to an existing file
        path.join(fromDirectory, moduleId);
}

import path from 'path';
import resolveFrom from 'resolve-from';

export function resolveModule(rootDir: string, moduleId: string) {
  // Use to deal with file paths and module names interchangeably.
  return path.isAbsolute(moduleId)
    ? moduleId
    : resolveFrom.silent(rootDir, moduleId) ||
        // Final attempt: Resolve relative paths that don't either
        // 1. Don't start with ./
        // 2. Don't point to an existing file
        path.join(rootDir, moduleId);
}

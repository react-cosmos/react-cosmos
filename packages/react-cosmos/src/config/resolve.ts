import path from 'path';
import resolveFrom from 'resolve-from';
import { slash } from '../shared/slash';

export function resolvePath(rootDir: string, filePath: string) {
  // Use to deal with file paths only
  return slash(path.resolve(rootDir, filePath));
}

export function resolveModule(rootDir: string, moduleId: string) {
  // Use to deal with file paths and module names interchangeably
  return slash(
    // An absolute path is already resolved
    path.isAbsolute(moduleId)
      ? moduleId
      : resolveFrom.silent(rootDir, moduleId) ||
          // Final attempt: Resolve relative paths that don't either
          // 1. Don't start with ./
          // 2. Don't point to an existing file
          path.join(rootDir, moduleId)
  );
}

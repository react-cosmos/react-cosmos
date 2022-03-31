import path from 'path';

export function resolveModule(rootDir: string, moduleId: string) {
  // Use to deal with file paths and module names interchangeably.
  return path.isAbsolute(moduleId)
    ? moduleId
    : resolveSilent(moduleId, rootDir) ||
        // Final attempt: Resolve relative paths that don't either
        // 1. Don't start with ./
        // 2. Don't point to an existing file
        path.join(rootDir, moduleId);
}

function resolveSilent(moduleId: string, rootDir: string) {
  try {
    return require.resolve(moduleId, { paths: [rootDir] });
  } catch (err) {
    return null;
  }
}

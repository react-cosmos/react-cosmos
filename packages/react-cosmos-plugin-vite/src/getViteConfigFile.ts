import path from 'node:path';
import { fileExists, moduleExists, resolveLoose } from 'react-cosmos';

export function getViteConfigFile(
  configPath: string | null | false,
  rootDir: string
) {
  // User can choose to prevent automatical use of an existing vite.config.js
  // file (relative to the root dir) by setting configPath to false
  if (configPath === false) {
    return false;
  }

  if (configPath === null) {
    const defaultAbsPath = resolveLoose(rootDir, 'vite.config.js');
    return moduleExists(defaultAbsPath) ? defaultAbsPath : false;
  }

  const absPath = resolveLoose(rootDir, configPath);

  if (!fileExists(absPath)) {
    const relPath = path.relative(process.cwd(), absPath);
    throw new Error(`Vite config not found at path: ${relPath}`);
  }

  return absPath;
}

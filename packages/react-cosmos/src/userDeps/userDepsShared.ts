import path from 'path';
import { slash } from '../utils/slash.js';
import { Json } from './shared.js';

export type UserDepsTemplateArgs = {
  globalImports: string[];
  fixturePaths: string[];
  decoratorPaths: string[];
  rendererConfig: Json;
  rootDir: string;
  relativeToDir: string | null;
};

export function userDepsImportMap(
  paths: string[],
  rootDir: string,
  relativeToDir: string | null
): Record<string, string> {
  return paths.reduce(
    (acc, p) => ({
      ...acc,
      [userDepsKeyPath(p, rootDir)]: userDepsImportPath(p, relativeToDir),
    }),
    {}
  );
}

export function userDepsKeyPath(filePath: string, rootDir: string) {
  return slash(path.relative(rootDir, filePath));
}

export function userDepsImportPath(
  filePath: string,
  relativeToDir: string | null
) {
  return slash(
    relativeToDir
      ? `.${path.sep}${path.relative(relativeToDir, filePath)}`
      : filePath
  );
}

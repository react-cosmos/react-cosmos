import path from 'path';
import { replaceKeys } from 'react-cosmos-core';
import { Json } from '../utils/json.js';
import { slash } from '../utils/slash.js';

export type UserImportsTemplateArgs = {
  globalImports: string[];
  fixturePaths: string[];
  decoratorPaths: string[];
  rendererConfig: Json;
  rootDir: string;
  relativeToDir: string | null;
  typeScript: boolean;
};

// NODE: These can be made configurable if a proper need arises
const FIXTURE_PATTERNS = [
  '**/<fixturesDir>/**/*.{js,jsx,ts,tsx}',
  '**/*.<fixtureFileSuffix>.{js,jsx,ts,tsx}',
];
const DECORATOR_PATTERNS = ['**/cosmos.decorator.{js,jsx,ts,tsx}'];

export function getFixturePatterns(
  fixturesDir: string,
  fixtureFileSuffix: string
): string[] {
  return FIXTURE_PATTERNS.map(pattern =>
    replaceKeys(pattern, {
      '<fixturesDir>': fixturesDir,
      '<fixtureFileSuffix>': fixtureFileSuffix,
    })
  );
}

export function getDecoratorPatterns() {
  return DECORATOR_PATTERNS;
}

export function createImportMap(
  paths: string[],
  rootDir: string,
  relativeToDir: string | null
): Record<string, string> {
  return paths.reduce(
    (acc, p) => ({
      ...acc,
      [importKeyPath(p, rootDir)]: importPath(p, relativeToDir),
    }),
    {}
  );
}

export function importKeyPath(filePath: string, rootDir: string) {
  return slash(path.relative(rootDir, filePath));
}

export function importPath(filePath: string, relativeToDir: string | null) {
  return slash(
    relativeToDir
      ? `.${path.sep}${path.relative(relativeToDir, filePath)}`
      : filePath
  );
}

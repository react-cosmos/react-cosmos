// @flow

import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import { replaceKeys } from '../util';

import type { FindUserModulePathsArgs, UserModulePaths } from './index.js.flow';

const globAsync = promisify(glob);

// TODO: Make paths configurable
const FILE_PATH_IGNORE = '**/node_modules/**';
const FIXTURE_PATTERNS = [
  '**/<fixturesDir>/**/*.{js,jsx,ts,tsx}',
  '**/*.<fixtureFileSuffix>.{js,jsx,ts,tsx}'
];
const DECORATOR_PATTERNS = ['**/cosmos.decorator.{js,jsx,ts,tsx}'];

export async function findUserModulePaths({
  rootDir,
  fixturesDir,
  fixtureFileSuffix
}: FindUserModulePathsArgs): Promise<UserModulePaths> {
  const paths = await globAsync('**/*', {
    cwd: rootDir,
    absolute: true,
    ignore: FILE_PATH_IGNORE
  });

  const patterns = getFixturePatterns({ fixturesDir, fixtureFileSuffix });
  const fixturePaths = getMatchingPaths(paths, patterns);
  const decoratorPaths = getMatchingPaths(paths, DECORATOR_PATTERNS);

  // IDEA: Omit fixture paths that are also decorator paths. Relevant only if
  // it becomes useful to put decorator files inside fixture dirs.
  return { fixturePaths, decoratorPaths };
}

function getMatchingPaths(paths, pattern): string[] {
  return micromatch(paths, pattern, { dot: true });
}

function getFixturePatterns({ fixturesDir, fixtureFileSuffix }): string[] {
  return FIXTURE_PATTERNS.map(pattern =>
    replaceKeys(pattern, {
      '<fixturesDir>': fixturesDir,
      '<fixtureFileSuffix>': fixtureFileSuffix
    })
  );
}

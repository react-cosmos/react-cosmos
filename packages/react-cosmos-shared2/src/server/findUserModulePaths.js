// @flow

import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import { replaceKeys } from '../util';

import type { FindUserModulePathsArgs, UserModulePaths } from './index.js.flow';

const globAsync = promisify(glob);

// TODO: Make paths configurable
const FILE_PATH_IGNORE = '**/node_modules/**';
const FIXTURE_MATCH = '**/<fixturesDir>/**/*.{js,jsx,ts,tsx}';
const DECORATOR_MATCH = '**/cosmos.decorator.{js,jsx,ts,tsx}';

export async function findUserModulePaths({
  rootDir,
  fixturesDir
}: FindUserModulePathsArgs): Promise<UserModulePaths> {
  const paths = await globAsync('**/*', {
    cwd: rootDir,
    absolute: true,
    ignore: FILE_PATH_IGNORE
  });

  const fixturePaths = getMatchingPaths(
    paths,
    getFixtureMatch({ fixturesDir })
  );
  const decoratorPaths = getMatchingPaths(paths, DECORATOR_MATCH);

  // IDEA: Omit fixture paths that are also decorator paths. Relevant only if
  // it becomes useful to put decorator files inside fixture dirs.
  return { fixturePaths, decoratorPaths };
}

function getMatchingPaths(paths, match): string[] {
  return micromatch(paths, match, { dot: true });
}

function getFixtureMatch({ fixturesDir }): string {
  return replaceKeys(FIXTURE_MATCH, { '<fixturesDir>': fixturesDir });
}

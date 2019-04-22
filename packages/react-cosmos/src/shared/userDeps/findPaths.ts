import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import {
  getFixturePatterns,
  getDecoratorPatterns,
  getIgnorePatterns
} from './shared';

type FindUserModulePathsArgs = {
  rootDir: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
};

type UserModulePaths = {
  fixturePaths: string[];
  decoratorPaths: string[];
};

const globAsync = promisify(glob);

export async function findUserModulePaths({
  rootDir,
  fixturesDir,
  fixtureFileSuffix
}: FindUserModulePathsArgs): Promise<UserModulePaths> {
  const paths = await globAsync('**/*', {
    cwd: rootDir,
    absolute: true,
    ignore: getIgnorePatterns()
  });

  const fixturePatterns = getFixturePatterns(fixturesDir, fixtureFileSuffix);
  const fixturePaths = getMatchingPaths(paths, fixturePatterns);
  const decoratorPaths = getMatchingPaths(paths, getDecoratorPatterns());

  // IDEA: Omit fixture paths that are also decorator paths. Relevant only if
  // it becomes useful to put decorator files inside fixture dirs.
  return { fixturePaths, decoratorPaths };
}

function getMatchingPaths(paths: string[], patterns: string[]): string[] {
  return micromatch(paths, patterns, { dot: true });
}

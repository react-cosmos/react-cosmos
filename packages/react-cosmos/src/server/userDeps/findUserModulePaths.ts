import glob from 'glob';
import micromatch from 'micromatch';
import {
  getDecoratorPatterns,
  getFixturePatterns,
  getIgnorePatterns,
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

export function findUserModulePaths({
  rootDir,
  fixturesDir,
  fixtureFileSuffix,
}: FindUserModulePathsArgs): UserModulePaths {
  const paths = glob.sync('**/*', {
    cwd: rootDir,
    absolute: true,
    ignore: getIgnorePatterns(),
  });

  const fixturePatterns = getFixturePatterns(fixturesDir, fixtureFileSuffix);
  const fixturePaths = getMatchingPaths(paths, fixturePatterns);
  const decoratorPaths = getMatchingPaths(paths, getDecoratorPatterns());

  // Omit decorators from fixture paths, which happens when decorators are
  // placed inside fixture dirs.
  const nonDecoratorFixturePaths = fixturePaths.filter(
    fixturePath => decoratorPaths.indexOf(fixturePath) === -1
  );

  return { fixturePaths: nonDecoratorFixturePaths, decoratorPaths };
}

function getMatchingPaths(paths: string[], patterns: string[]): string[] {
  return micromatch(paths, patterns, { dot: true });
}

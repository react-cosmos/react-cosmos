import { globSync } from 'glob';
import micromatch from 'micromatch';
import {
  UserModulePaths,
  getDecoratorPatterns,
  getFixturePatterns,
} from './shared.js';

type FindUserModulePathsArgs = {
  rootDir: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  ignore: string[];
};
export function findUserModulePaths({
  rootDir,
  fixturesDir,
  fixtureFileSuffix,
  ignore,
}: FindUserModulePathsArgs): UserModulePaths {
  const paths = globSync('**/*', {
    cwd: rootDir,
    absolute: true,
    ignore,
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

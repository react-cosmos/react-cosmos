import { glob } from 'glob';
import micromatch from 'micromatch';
import type { UserModuleConfig, UserModulePaths } from './shared.js';
import { getDecoratorPatterns, getFixturePatterns } from './shared.js';

export async function findUserModulePaths({
  rootDir,
  fixturesDir,
  fixtureFileSuffix,
  ignore,
}: UserModuleConfig): Promise<UserModulePaths> {
  const paths = await glob('**/*', {
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

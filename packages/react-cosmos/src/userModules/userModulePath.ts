import path from 'node:path';
import micromatch from 'micromatch';
import { slash } from '../utils/slash.js';
import type { UserModuleConfig } from './shared.js';
import { getDecoratorPatterns, getFixturePatterns } from './shared.js';

// These check single paths for watchers, which see dirs and files one by one.
// Like findUserModulePaths, they answer two questions: whether a path is
// skipped (a skipped dir has no user modules inside), and whether a file that
// isn't skipped matches the fixture and decorator patterns.

export function isIgnoredPath(
  { rootDir, ignore }: UserModuleConfig,
  absPath: string
) {
  const relPath = slash(path.relative(rootDir, absPath));
  return (
    // On Windows, paths on another drive stay absolute
    path.isAbsolute(relPath) ||
    // Dot entries, which also covers paths outside the root dir (../)
    relPath.split('/').some(segment => segment.startsWith('.')) ||
    micromatch.isMatch(relPath, ignore, { dot: true })
  );
}

export function isUserModulePath(config: UserModuleConfig, absPath: string) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = config;
  const relPath = slash(path.relative(rootDir, absPath));
  const patterns = [
    ...getFixturePatterns(fixturesDir, fixtureFileSuffix),
    ...getDecoratorPatterns(),
  ];
  return (
    !isIgnoredPath(config, absPath) &&
    micromatch.isMatch(relPath, patterns, { dot: true })
  );
}

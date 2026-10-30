import path from 'node:path';
import micromatch from 'micromatch';
import type { CosmosConfig } from '../cosmosConfig/types.js';
import { slash } from '../utils/slash.js';
import { getDecoratorPatterns, getFixturePatterns } from './shared.js';

type UserModulePathConfig = Pick<
  CosmosConfig,
  'rootDir' | 'fixturesDir' | 'fixtureFileSuffix' | 'ignore'
>;

// These match single paths the way findUserModulePaths scans for them: dot
// entries, ignored paths and paths outside the root dir are skipped.
export function isIgnoredPath(
  { rootDir, ignore }: UserModulePathConfig,
  filePath: string
) {
  const relPath = slash(path.relative(rootDir, filePath));
  return (
    relPath.split('/').some(segment => segment.startsWith('.')) ||
    micromatch.isMatch(relPath, ignore, { dot: true })
  );
}

export function isUserModulePath(
  config: UserModulePathConfig,
  filePath: string
) {
  const { rootDir, fixturesDir, fixtureFileSuffix } = config;
  const relPath = slash(path.relative(rootDir, filePath));
  const patterns = [
    ...getFixturePatterns(fixturesDir, fixtureFileSuffix),
    ...getDecoratorPatterns(),
  ];
  return (
    !isIgnoredPath(config, filePath) &&
    micromatch.isMatch(relPath, patterns, { dot: true })
  );
}

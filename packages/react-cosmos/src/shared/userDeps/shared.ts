import { replaceKeys } from '../shared';

// NODE: These can be made configurable if a proper need arises
const FIXTURE_PATTERNS = [
  '**/<fixturesDir>/**/*.{js,jsx,ts,tsx}',
  '**/*.<fixtureFileSuffix>.{js,jsx,ts,tsx}'
];
const DECORATOR_PATTERNS = ['**/cosmos.decorator.{js,jsx,ts,tsx}'];
const IGNORE_PATTERNS = '**/node_modules/**';

export function getFixturePatterns(
  fixturesDir: string,
  fixtureFileSuffix: string
): string[] {
  return FIXTURE_PATTERNS.map(pattern =>
    replaceKeys(pattern, {
      '<fixturesDir>': fixturesDir,
      '<fixtureFileSuffix>': fixtureFileSuffix
    })
  );
}

export function getDecoratorPatterns() {
  return DECORATOR_PATTERNS;
}

export function getIgnorePatterns() {
  return IGNORE_PATTERNS;
}

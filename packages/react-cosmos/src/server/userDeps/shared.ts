import { replaceKeys } from 'react-cosmos-core';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[];

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

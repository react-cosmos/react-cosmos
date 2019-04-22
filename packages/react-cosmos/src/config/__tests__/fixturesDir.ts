import { createCosmosConfig } from '..';

it('returns default fixturesDir', () => {
  const cosmosConfig = createCosmosConfig({});
  expect(cosmosConfig.fixturesDir).toBe('__fixtures__');
});

it('returns custom fixturesDir', () => {
  const cosmosConfig = createCosmosConfig({ fixturesDir: '__jsxfixtures__' });
  expect(cosmosConfig.fixturesDir).toBe('__jsxfixtures__');
});

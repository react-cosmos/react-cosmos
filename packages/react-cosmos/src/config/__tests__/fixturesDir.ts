import { CosmosConfig } from '..';

it('returns default fixturesDir', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.fixturesDir).toBe('__fixtures__');
});

it('returns custom fixturesDir', () => {
  const cosmosConfig = new CosmosConfig({ fixturesDir: '__jsxfixtures__' });
  expect(cosmosConfig.fixturesDir).toBe('__jsxfixtures__');
});

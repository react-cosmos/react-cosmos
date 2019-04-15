import { CosmosConfig } from '..';

it('returns default fixturesDir', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getFixturesDir()).toBe('__fixtures__');
});

it('returns custom fixturesDir', () => {
  const cosmosConfig = new CosmosConfig({ fixturesDir: '__jsxfixtures__' });
  expect(cosmosConfig.getFixturesDir()).toBe('__jsxfixtures__');
});

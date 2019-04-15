import { CosmosConfig } from '..';

it('returns default fixtureFileSuffix', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getFixtureFileSuffix()).toBe('fixture');
});

it('returns custom fixtureFileSuffix', () => {
  const cosmosConfig = new CosmosConfig({ fixtureFileSuffix: 'jsxfixture' });
  expect(cosmosConfig.getFixtureFileSuffix()).toBe('jsxfixture');
});

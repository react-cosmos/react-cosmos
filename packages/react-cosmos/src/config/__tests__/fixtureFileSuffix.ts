import { CosmosConfig } from '..';

it('returns default fixtureFileSuffix', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.fixtureFileSuffix).toBe('fixture');
});

it('returns custom fixtureFileSuffix', () => {
  const cosmosConfig = new CosmosConfig({ fixtureFileSuffix: 'jsxfixture' });
  expect(cosmosConfig.fixtureFileSuffix).toBe('jsxfixture');
});

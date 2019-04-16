import { createCosmosConfig } from '..';

it('returns default fixtureFileSuffix', () => {
  const cosmosConfig = createCosmosConfig({});
  expect(cosmosConfig.fixtureFileSuffix).toBe('fixture');
});

it('returns custom fixtureFileSuffix', () => {
  const cosmosConfig = createCosmosConfig({ fixtureFileSuffix: 'jsxfixture' });
  expect(cosmosConfig.fixtureFileSuffix).toBe('jsxfixture');
});

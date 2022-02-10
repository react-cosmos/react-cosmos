import { createCosmosConfig } from '../createCosmosConfig';

it('returns default fixtureFileSuffix', () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.fixtureFileSuffix).toBe('fixture');
});

it('returns custom fixtureFileSuffix', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    fixtureFileSuffix: 'jsxfixture',
  });
  expect(cosmosConfig.fixtureFileSuffix).toBe('jsxfixture');
});

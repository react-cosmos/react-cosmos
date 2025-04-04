import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns default fixtureFileSuffix', () => {
  const config = createCosmosConfig(process.cwd());
  expect(config.fixtureFileSuffix).toBe('fixture');
});

it('returns custom fixtureFileSuffix', () => {
  const config = createCosmosConfig(process.cwd(), {
    fixtureFileSuffix: 'jsxfixture',
  });
  expect(config.fixtureFileSuffix).toBe('jsxfixture');
});

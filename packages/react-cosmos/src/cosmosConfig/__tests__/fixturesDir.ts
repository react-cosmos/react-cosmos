import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns default fixturesDir', () => {
  const config = createCosmosConfig(process.cwd(), {});
  expect(config.fixturesDir).toBe('__fixtures__');
});

it('returns custom fixturesDir', () => {
  const config = createCosmosConfig(process.cwd(), {
    fixturesDir: '__jsxfixtures__',
  });
  expect(config.fixturesDir).toBe('__jsxfixtures__');
});

import '../../testHelpers/mockResolve.js';

import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns default fixturesDir', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {});
  expect(cosmosConfig.fixturesDir).toBe('__fixtures__');
});

it('returns custom fixturesDir', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    fixturesDir: '__jsxfixtures__',
  });
  expect(cosmosConfig.fixturesDir).toBe('__jsxfixtures__');
});

// Module mocks need to be imported before the mocked module is imported,
// even if the module is not used in the test. Otherwise the mocks won't apply.
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(() => {
  unmockCliArgs();
});

it('defaults lazy to false', () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.lazy).toBe(false);
});

it('uses --lazy CLI arg', () => {
  mockCliArgs({ lazy: true });

  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.lazy).toBe(true);
});

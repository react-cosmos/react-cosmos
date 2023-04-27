// Import mocks first
import '../../testHelpers/mockEsmResolve.js';
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

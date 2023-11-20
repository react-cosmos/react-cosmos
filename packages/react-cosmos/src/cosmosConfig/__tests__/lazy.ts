// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
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

// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(async () => {
  await unmockCliArgs();
});

it('returns default port retries', () => {
  const { portRetries } = createCosmosConfig(process.cwd());
  expect(portRetries).toBe(10);
});

it('returns custom port retries', () => {
  const { portRetries } = createCosmosConfig(process.cwd(), { portRetries: 3 });
  expect(portRetries).toBe(3);
});

it('returns port retries from --port-retries arg', async () => {
  await mockCliArgs({ portRetries: 0 });
  const { portRetries } = createCosmosConfig(process.cwd(), { portRetries: 3 });
  expect(portRetries).toBe(0);
});

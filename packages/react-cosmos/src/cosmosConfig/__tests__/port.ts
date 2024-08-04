// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(async () => {
  await unmockCliArgs();
});

it('returns default port', () => {
  const { port } = createCosmosConfig(process.cwd());
  expect(port).toBe(5000);
});

it('returns custom port', () => {
  const { port } = createCosmosConfig(process.cwd(), { port: 8989 });
  expect(port).toBe(8989);
});

it('returns port from --port arg', async () => {
  await mockCliArgs({ port: 1337 });
  const { port } = createCosmosConfig(process.cwd());
  expect(port).toBe(1337);
});

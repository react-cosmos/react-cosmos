// Import mocks first
import '../../testHelpers/mockResolve.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(() => {
  unmockCliArgs();
});

it('returns default port', () => {
  const { port } = createCosmosConfig(process.cwd());
  expect(port).toBe(5000);
});

it('returns custom port', () => {
  const { port } = createCosmosConfig(process.cwd(), { port: 8989 });
  expect(port).toBe(8989);
});

it('returns port from --port arg', () => {
  mockCliArgs({ port: 1337 });
  const { port } = createCosmosConfig(process.cwd());
  expect(port).toBe(1337);
});

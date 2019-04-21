import { mockCliArgs, unmockCliArgs } from '../../../testHelpers/mockYargs';
import { createCosmosConfig } from '..';

afterEach(() => {
  unmockCliArgs();
});

it('returns default port', () => {
  const { port } = createCosmosConfig({});
  expect(port).toBe(5000);
});

it('returns custom port', () => {
  const { port } = createCosmosConfig({ port: 8989 });
  expect(port).toBe(8989);
});

it('returns port from --port arg', () => {
  mockCliArgs({ port: 1337 });
  const { port } = createCosmosConfig({});
  expect(port).toBe(1337);
});

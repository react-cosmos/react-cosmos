import { mockCliArgs, unmockCliArgs } from '../testHelpers';
import { CosmosConfig } from '..';

afterEach(() => {
  unmockCliArgs();
});

it('returns default port', () => {
  const { port } = new CosmosConfig({});
  expect(port).toBe(5000);
});

it('returns custom port', () => {
  const { port } = new CosmosConfig({ port: 8989 });
  expect(port).toBe(8989);
});

it('returns port from --port arg', () => {
  mockCliArgs({ port: 1337 });
  const { port } = new CosmosConfig({});
  expect(port).toBe(1337);
});

import { mockCliArgs, unmockCliArgs } from '../testHelpers';
import { CosmosConfig } from '..';

afterEach(() => {
  unmockCliArgs();
});

it('returns default port', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getPort()).toBe(5000);
});

it('returns custom port', () => {
  const cosmosConfig = new CosmosConfig({ port: 8989 });
  expect(cosmosConfig.getPort()).toBe(8989);
});

it('returns port from --port arg', () => {
  mockCliArgs({ port: 1337 });
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getPort()).toBe(1337);
});

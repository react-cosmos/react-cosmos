import { CosmosConfig } from '..';

it('returns default hostname', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getHostname()).toBe(null);
});

it('returns custom hostname', () => {
  const cosmosConfig = new CosmosConfig({ hostname: 'localhost' });
  expect(cosmosConfig.getHostname()).toBe('localhost');
});

import { CosmosConfig } from '..';

it('returns default hostname', () => {
  const { hostname } = new CosmosConfig({});
  expect(hostname).toBe(null);
});

it('returns custom hostname', () => {
  const { hostname } = new CosmosConfig({ hostname: 'localhost' });
  expect(hostname).toBe('localhost');
});

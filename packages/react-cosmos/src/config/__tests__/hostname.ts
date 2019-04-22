import { createCosmosConfig } from '..';

it('returns default hostname', () => {
  const { hostname } = createCosmosConfig({});
  expect(hostname).toBe(null);
});

it('returns custom hostname', () => {
  const { hostname } = createCosmosConfig({ hostname: 'localhost' });
  expect(hostname).toBe('localhost');
});

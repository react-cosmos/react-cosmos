import { createCosmosConfig } from '..';

it('returns default hostname', () => {
  const { hostname } = createCosmosConfig(process.cwd());
  expect(hostname).toBe(null);
});

it('returns custom hostname', () => {
  const { hostname } = createCosmosConfig(process.cwd(), {
    hostname: 'localhost'
  });
  expect(hostname).toBe('localhost');
});

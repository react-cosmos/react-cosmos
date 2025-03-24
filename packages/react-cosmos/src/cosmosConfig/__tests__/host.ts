import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns default host', () => {
  const { host } = createCosmosConfig(process.cwd());
  expect(host).toBe(null);
});

it('returns custom host', () => {
  const { host } = createCosmosConfig(process.cwd(), {
    host: 'localhost',
  });
  expect(host).toBe('localhost');
});

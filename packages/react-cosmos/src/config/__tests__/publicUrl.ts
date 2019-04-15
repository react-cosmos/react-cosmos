import { CosmosConfig } from '..';

it('returns default publicUrl', () => {
  const { publicUrl } = new CosmosConfig({});
  expect(publicUrl).toBe('/');
});

it('returns custom publicUrl', () => {
  const { publicUrl } = new CosmosConfig({ publicUrl: '/path/' });
  expect(publicUrl).toBe('/path/');
});

import { createCosmosConfig } from '..';

it('returns default publicUrl', () => {
  const { publicUrl } = createCosmosConfig({});
  expect(publicUrl).toBe('/');
});

it('returns custom publicUrl', () => {
  const { publicUrl } = createCosmosConfig({ publicUrl: '/path/' });
  expect(publicUrl).toBe('/path/');
});

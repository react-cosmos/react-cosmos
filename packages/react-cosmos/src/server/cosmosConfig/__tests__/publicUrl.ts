// Import mocks first
import '../../testHelpers/mockResolve.js';

import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns default publicUrl', () => {
  const { publicUrl } = createCosmosConfig(process.cwd());
  expect(publicUrl).toBe('/');
});

it('returns custom publicUrl', () => {
  const { publicUrl } = createCosmosConfig(process.cwd(), {
    publicUrl: '/path/',
  });
  expect(publicUrl).toBe('/path/');
});

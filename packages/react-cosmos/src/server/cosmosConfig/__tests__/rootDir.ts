// Import mocks first
import '../../testHelpers/mockResolve.js';

import { getCwdPath } from '../../testHelpers/cwd.js';
import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns root dir from cwd', () => {
  const { rootDir } = createCosmosConfig(process.cwd());
  expect(rootDir).toBe(getCwdPath());
});

it('returns root dir from config', () => {
  const { rootDir } = createCosmosConfig(getCwdPath('..'));
  expect(rootDir).toBe(getCwdPath('..'));
});

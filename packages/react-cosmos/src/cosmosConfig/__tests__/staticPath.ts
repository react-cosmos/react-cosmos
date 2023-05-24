import { join } from 'path';
import { getCwdPath } from '../../testHelpers/cwd.js';
import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns default null static path', () => {
  const { staticPath } = createCosmosConfig(process.cwd());
  expect(staticPath).toBe(null);
});

it('returns custom static path', () => {
  const { staticPath } = createCosmosConfig(process.cwd(), {
    staticPath: 'static',
  });
  expect(staticPath).toBe(getCwdPath('static'));
});

it('returns custom static path from custom root dir', () => {
  const { staticPath } = createCosmosConfig(join(process.cwd(), 'subdir'), {
    staticPath: 'static',
  });
  expect(staticPath).toBe(getCwdPath('subdir/static'));
});

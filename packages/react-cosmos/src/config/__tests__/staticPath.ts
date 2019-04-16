import { getCwdPath } from '../testHelpers';
import { createCosmosConfig } from '..';

it('returns default null static path', () => {
  const { staticPath } = createCosmosConfig({});
  expect(staticPath).toBe(null);
});

it('returns custom static path', () => {
  const { staticPath } = createCosmosConfig({ staticPath: 'static' });
  expect(staticPath).toBe(getCwdPath('static'));
});

it('returns custom static path from custom root dir', () => {
  const { staticPath } = createCosmosConfig({
    rootDir: 'subdir',
    staticPath: 'static'
  });
  expect(staticPath).toBe(getCwdPath('subdir/static'));
});

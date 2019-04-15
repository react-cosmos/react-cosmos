import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns default null static path', () => {
  const { staticPath } = new CosmosConfig({});
  expect(staticPath).toBe(null);
});

it('returns custom static path', () => {
  const { staticPath } = new CosmosConfig({ staticPath: 'static' });
  expect(staticPath).toBe(getCwdPath('static'));
});

it('returns custom static path from custom root dir', () => {
  const { staticPath } = new CosmosConfig({
    rootDir: 'subdir',
    staticPath: 'static'
  });
  expect(staticPath).toBe(getCwdPath('subdir/static'));
});

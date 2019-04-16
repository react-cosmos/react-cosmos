import { getCwdPath } from '../testHelpers';
import { createCosmosConfig } from '..';

it('returns default export path', () => {
  const { exportPath } = createCosmosConfig({});
  expect(exportPath).toBe(getCwdPath('cosmos-export'));
});

it('returns default export path from custom root dir', () => {
  const { exportPath } = createCosmosConfig({ rootDir: 'subdir' });
  expect(exportPath).toBe(getCwdPath('subdir/cosmos-export'));
});

it('returns custom export path', () => {
  const { exportPath } = createCosmosConfig({ exportPath: 'my-export-path' });
  expect(exportPath).toBe(getCwdPath('my-export-path'));
});

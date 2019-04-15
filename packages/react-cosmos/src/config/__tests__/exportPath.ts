import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns default export path', () => {
  const { exportPath } = new CosmosConfig({});
  expect(exportPath).toBe(getCwdPath('cosmos-export'));
});

it('returns default export path from custom root dir', () => {
  const { exportPath } = new CosmosConfig({ rootDir: 'subdir' });
  expect(exportPath).toBe(getCwdPath('subdir/cosmos-export'));
});

it('returns custom export path', () => {
  const { exportPath } = new CosmosConfig({ exportPath: 'my-export-path' });
  expect(exportPath).toBe(getCwdPath('my-export-path'));
});

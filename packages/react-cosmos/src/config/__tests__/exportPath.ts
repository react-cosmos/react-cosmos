import { getCwdPath } from '../../testHelpers/cwd';
import { createCosmosConfig } from '..';

it('returns default export path', () => {
  const { exportPath } = createCosmosConfig(process.cwd(), {});
  expect(exportPath).toBe(getCwdPath('cosmos-export'));
});

it('returns default export path from custom root dir', () => {
  const { exportPath } = createCosmosConfig(getCwdPath('subdir'));
  expect(exportPath).toBe(getCwdPath('subdir/cosmos-export'));
});

it('returns custom export path', () => {
  const { exportPath } = createCosmosConfig(process.cwd(), {
    exportPath: 'my-export-path'
  });
  expect(exportPath).toBe(getCwdPath('my-export-path'));
});

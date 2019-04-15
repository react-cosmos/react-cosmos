import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns default export path', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getExportPath()).toBe(getCwdPath('cosmos-export'));
});

it('returns default export path from custom root dir', () => {
  const cosmosConfig = new CosmosConfig({ rootDir: 'subdir' });
  expect(cosmosConfig.getExportPath()).toBe(getCwdPath('subdir/cosmos-export'));
});

it('returns custom export path', () => {
  const cosmosConfig = new CosmosConfig({ exportPath: 'my-export-path' });
  expect(cosmosConfig.getExportPath()).toBe(getCwdPath('my-export-path'));
});

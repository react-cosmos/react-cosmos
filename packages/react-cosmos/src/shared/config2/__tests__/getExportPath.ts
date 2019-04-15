import {
  getCwdPath,
  mockCwd,
  unmockCwd,
  mockCosmosConfig,
  unmockFs
} from '../testHelpers';
import { getExportPath } from '..';

beforeEach(() => {
  mockCwd();
});

afterEach(() => {
  unmockCwd();
  unmockFs();
});

it('returns default export path', () => {
  expect(getExportPath()).toBe(getCwdPath('cosmos-export'));
});

it('returns default export path from custom root dir', () => {
  mockCosmosConfig('cosmos.config.json', { rootDir: 'subdir' });
  expect(getExportPath()).toBe(getCwdPath('subdir/cosmos-export'));
});

it('returns custom export path', () => {
  mockCosmosConfig('cosmos.config.json', { exportPath: 'my-export-path' });
  expect(getExportPath()).toBe(getCwdPath('my-export-path'));
});

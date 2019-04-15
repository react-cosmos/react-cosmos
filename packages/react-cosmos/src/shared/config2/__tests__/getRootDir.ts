import {
  getCwdPath,
  mockCwd,
  unmockCwd,
  mockCliArgs,
  unmockCliArgs,
  mockCosmosConfig,
  mockDir,
  unmockFs
} from '../testHelpers';
import { getRootDir } from '..';

beforeEach(() => {
  mockCwd();
});

afterEach(() => {
  unmockCwd();
  unmockCliArgs();
  unmockFs();
});

it('returns root dir from --root-dir', () => {
  mockDir('subdir');
  mockCliArgs({ rootDir: 'subdir' });
  expect(getRootDir()).toBe(getCwdPath('subdir'));
});

it('throws on invalid --root-dir path', () => {
  mockCliArgs({ rootDir: 'subdir' });
  expect(() => getRootDir()).toThrow('[Cosmos] Dir not found at path: subdir');
});

it('returns root dir from cwd', () => {
  mockCliArgs({});
  expect(getRootDir()).toBe(getCwdPath());
});

it('returns root dir from cosmosConfig.rootDir', () => {
  mockCosmosConfig('cosmos.config.json', { rootDir: '..' });
  mockCliArgs({});
  expect(getRootDir()).toBe(getCwdPath('..'));
});

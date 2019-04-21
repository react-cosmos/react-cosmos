import { mockCliArgs, unmockCliArgs } from '../../../testHelpers/mockYargs';
import { getCwdPath, mockDir, unmockFs } from '../testHelpers';
import { createCosmosConfig } from '..';

afterEach(() => {
  unmockCliArgs();
  unmockFs();
});

it('returns root dir from --root-dir', () => {
  mockDir('subdir');
  mockCliArgs({ rootDir: 'subdir' });
  const { rootDir } = createCosmosConfig({});
  expect(rootDir).toBe(getCwdPath('subdir'));
});

it('throws on invalid --root-dir path', () => {
  mockCliArgs({ rootDir: 'subdir' });
  expect(() => createCosmosConfig({})).toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns root dir from cwd', () => {
  const { rootDir } = createCosmosConfig({});
  expect(rootDir).toBe(getCwdPath());
});

it('returns root dir from config', () => {
  const { rootDir } = createCosmosConfig({ rootDir: '..' });
  expect(rootDir).toBe(getCwdPath('..'));
});

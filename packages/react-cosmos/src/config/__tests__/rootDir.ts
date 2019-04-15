import {
  getCwdPath,
  mockCliArgs,
  unmockCliArgs,
  mockDir,
  unmockFs
} from '../testHelpers';
import { CosmosConfig } from '..';

afterEach(() => {
  unmockCliArgs();
  unmockFs();
});

it('returns root dir from --root-dir', () => {
  mockDir('subdir');
  mockCliArgs({ rootDir: 'subdir' });
  const { rootDir } = new CosmosConfig({});
  expect(rootDir).toBe(getCwdPath('subdir'));
});

it('throws on invalid --root-dir path', () => {
  mockCliArgs({ rootDir: 'subdir' });
  const cosmosConfig = new CosmosConfig({});
  expect(() => cosmosConfig.rootDir).toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns root dir from cwd', () => {
  const { rootDir } = new CosmosConfig({});
  expect(rootDir).toBe(getCwdPath());
});

it('returns root dir from config', () => {
  const { rootDir } = new CosmosConfig({ rootDir: '..' });
  expect(rootDir).toBe(getCwdPath('..'));
});

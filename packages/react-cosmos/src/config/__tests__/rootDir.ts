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
  const cosmosConfig = new CosmosConfig({});
  mockDir('subdir');
  mockCliArgs({ rootDir: 'subdir' });
  expect(cosmosConfig.getRootDir()).toBe(getCwdPath('subdir'));
});

it('throws on invalid --root-dir path', () => {
  const cosmosConfig = new CosmosConfig({});
  mockCliArgs({ rootDir: 'subdir' });
  expect(() => cosmosConfig.getRootDir()).toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns root dir from cwd', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getRootDir()).toBe(getCwdPath());
});

it('returns root dir from cosmosConfig.rootDir', () => {
  const cosmosConfig = new CosmosConfig({ rootDir: '..' });
  expect(cosmosConfig.getRootDir()).toBe(getCwdPath('..'));
});

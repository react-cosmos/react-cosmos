import { getCwdPath, mockCliArgs, mockCosmosConfig } from '../testHelpers';
import { getRootDir } from '..';

it('returns root dir from --root-dir', () => {
  mockCliArgs({ rootDir: 'subdir' }, () => {
    expect(getRootDir()).toBe(getCwdPath('subdir'));
  });
});

it('returns root dir from cwd', () => {
  mockCliArgs({}, () => {
    expect(getRootDir()).toBe(getCwdPath());
  });
});

it('returns root dir from cosmosConfig.rootDir', () => {
  mockCosmosConfig('cosmos.config.json', { rootDir: '..' }, () => {
    mockCliArgs({}, () => {
      expect(getRootDir()).toBe(getCwdPath('..'));
    });
  });
});

import { getCwdPath } from '../../testHelpers/cwd';
import { createCosmosConfig } from '..';

it('returns root dir from cwd', () => {
  const { rootDir } = createCosmosConfig(process.cwd());
  expect(rootDir).toBe(getCwdPath());
});

it('returns root dir from config', () => {
  const { rootDir } = createCosmosConfig(getCwdPath('..'));
  expect(rootDir).toBe(getCwdPath('..'));
});

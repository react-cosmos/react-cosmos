import { getCwdPath } from '../../testHelpers/cwd';
import { createCosmosConfig } from '..';

it('returns resolved default watchDirs', () => {
  const cosmosConfig = createCosmosConfig({});
  expect(cosmosConfig.watchDirs).toEqual([getCwdPath('.')]);
});

it('returns resolved custom watchDirs', () => {
  const cosmosConfig = createCosmosConfig({ watchDirs: ['src1', 'src2'] });
  expect(cosmosConfig.watchDirs).toEqual([
    getCwdPath('src1'),
    getCwdPath('src2')
  ]);
});

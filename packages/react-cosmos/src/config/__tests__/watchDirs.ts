import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns resolved default watchDirs', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getWatchDirs()).toEqual([getCwdPath('.')]);
});

it('returns resolved custom watchDirs', () => {
  const cosmosConfig = new CosmosConfig({ watchDirs: ['src1', 'src2'] });
  expect(cosmosConfig.getWatchDirs()).toEqual([
    getCwdPath('src1'),
    getCwdPath('src2')
  ]);
});

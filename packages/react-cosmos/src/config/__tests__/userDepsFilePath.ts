import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns resolved default getUserDepsFilePath', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getUserDepsFilePath()).toBe(
    getCwdPath('cosmos.userdeps.js')
  );
});

it('returns resolved custom getUserDepsFilePath', () => {
  const cosmosConfig = new CosmosConfig({ userDepsFilePath: 'heremydeps.js' });
  expect(cosmosConfig.getUserDepsFilePath()).toBe(getCwdPath('heremydeps.js'));
});

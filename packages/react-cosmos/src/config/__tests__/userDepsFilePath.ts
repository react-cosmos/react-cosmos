import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns resolved default getUserDepsFilePath', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.userDepsFilePath).toBe(getCwdPath('cosmos.userdeps.js'));
});

it('returns resolved custom getUserDepsFilePath', () => {
  const cosmosConfig = new CosmosConfig({ userDepsFilePath: 'heremydeps.js' });
  expect(cosmosConfig.userDepsFilePath).toBe(getCwdPath('heremydeps.js'));
});

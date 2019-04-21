import { getCwdPath } from '../../testHelpers/cwd';
import { createCosmosConfig } from '..';

it('returns resolved default getUserDepsFilePath', () => {
  const cosmosConfig = createCosmosConfig({});
  expect(cosmosConfig.userDepsFilePath).toBe(getCwdPath('cosmos.userdeps.js'));
});

it('returns resolved custom getUserDepsFilePath', () => {
  const cosmosConfig = createCosmosConfig({
    userDepsFilePath: 'heremydeps.js'
  });
  expect(cosmosConfig.userDepsFilePath).toBe(getCwdPath('heremydeps.js'));
});

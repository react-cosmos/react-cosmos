// Import mocks first
import '../../testHelpers/mockEsmResolve.js';

import { getCwdPath } from '../../testHelpers/cwd.js';
import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns resolved default getUserDepsFilePath', () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.userDepsFilePath).toBe(getCwdPath('cosmos.userdeps.ts'));
});

it('returns resolved custom getUserDepsFilePath', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    userDepsFilePath: 'heremydeps.js',
  });
  expect(cosmosConfig.userDepsFilePath).toBe(getCwdPath('heremydeps.js'));
});

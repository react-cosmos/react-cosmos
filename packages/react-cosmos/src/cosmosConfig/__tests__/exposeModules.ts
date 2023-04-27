// Import mocks first
import '../../testHelpers/mockEsmResolve.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { getCwdPath } from '../../testHelpers/cwd.js';
import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(() => {
  unmockCliArgs();
});

it('does not expose modules by default', () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.exposeModules).toBe(false);
});

it('returns resolved user modules path', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    exposeModules: 'src/myCosmosModules.ts',
  });
  expect(cosmosConfig.exposeModules).toBe(getCwdPath('src/myCosmosModules.ts'));
});

it('uses --exportModules CLI arg', () => {
  mockCliArgs({ exposeModules: true });

  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.exposeModules).toBe(true);
});

it('resolves --exportModules CLI arg path', () => {
  mockCliArgs({ exposeModules: 'src/myCosmosModules.ts' });

  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.exposeModules).toBe(getCwdPath('src/myCosmosModules.ts'));
});

// Import mocks first
import '../../testHelpers/mockEsmResolve.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import { getCwdPath } from '../../testHelpers/cwd.js';
import { createCosmosConfig } from '../createCosmosConfig.js';

afterEach(() => {
  unmockCliArgs();
});

it('does not expose imports by default', () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.exposeImports).toBe(false);
});

it('returns resolved user imports path', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    exposeImports: 'src/myImports.ts',
  });
  expect(cosmosConfig.exposeImports).toBe(getCwdPath('src/myImports.ts'));
});

it('uses --exportImports CLI arg', () => {
  mockCliArgs({ exposeImports: true });

  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.exposeImports).toBe(true);
});

it('resolves --exportImports CLI arg path', () => {
  mockCliArgs({ exposeImports: 'src/myImports.ts' });

  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.exposeImports).toBe(getCwdPath('src/myImports.ts'));
});

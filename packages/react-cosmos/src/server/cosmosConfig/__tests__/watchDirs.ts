// Import mocks first
import '../../testHelpers/mockEsmResolve.js';

import path from 'path';
import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns resolved default watchDirs', () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  expect(cosmosConfig.watchDirs).toEqual([process.cwd()]);
});

it('returns resolved custom watchDirs', () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    watchDirs: ['src1', 'src2'],
  });
  expect(cosmosConfig.watchDirs).toEqual([
    path.resolve(process.cwd(), 'src1'),
    path.resolve(process.cwd(), 'src2'),
  ]);
});

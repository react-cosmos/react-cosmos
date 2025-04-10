import path from 'path';
import { createCosmosConfig } from '../createCosmosConfig.js';

it('returns resolved default watchDirs', () => {
  const config = createCosmosConfig(process.cwd());
  expect(config.watchDirs).toEqual([process.cwd()]);
});

it('returns resolved custom watchDirs', () => {
  const config = createCosmosConfig(process.cwd(), {
    watchDirs: ['src1', 'src2'],
  });
  expect(config.watchDirs).toEqual([
    path.join(process.cwd(), 'src1'),
    path.join(process.cwd(), 'src2'),
  ]);
});

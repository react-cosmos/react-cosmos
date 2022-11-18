import fs from 'fs/promises';
import glob from 'glob';
import { done } from './shared.js';

(async () => {
  const distPaths = glob.sync(`./packages/*/dist`) as string[];
  await Promise.all(
    distPaths.map(p => fs.rm(p, { recursive: true, force: true }))
  );
  console.log(done(`Cleared all build files.`));
})();

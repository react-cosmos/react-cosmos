import fs from 'fs/promises';
import { globSync } from 'glob';
import { done } from './shared.js';

(async () => {
  const distPaths = globSync(`./packages/*/dist`);
  await Promise.all(
    distPaths.map(p => fs.rm(p, { recursive: true, force: true }))
  );
  console.log(done(`Cleared all build files.`));
})();

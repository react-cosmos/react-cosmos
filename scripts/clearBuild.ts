import fs from 'fs/promises';
import { done, globAsync } from './shared.js';

(async () => {
  const distPaths = (await globAsync(`./packages/*/dist`)) as string[];
  await Promise.all(
    distPaths.map(p => fs.rm(p, { recursive: true, force: true }))
  );
  console.log(done(`Cleared all build files.`));
})();

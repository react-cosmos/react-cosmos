import { execSync } from 'child_process';
import fs from 'fs/promises';

(async function () {
  execSync('yarn workspace example-todo export');
  await fs.cp('./examples/todo/cosmos-export', './docs/out/demo', {
    recursive: true,
  });
})();

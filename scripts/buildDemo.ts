import { execSync } from 'child_process';
import fs from 'fs/promises';

(async function () {
  execSync('npm --workspace example-todo run export');
  await fs.cp('./examples/todo/cosmos-export', './docs/out/demo', {
    recursive: true,
  });
})();

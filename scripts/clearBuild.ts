import { globAsync, rimrafAsync, done } from './shared';

run();

async function run() {
  const distPaths = (await globAsync(`./packages/*/dist`)) as string[];
  await Promise.all(distPaths.map(p => rimrafAsync(p)));
  console.log(done(`Cleared all build files.`));
}

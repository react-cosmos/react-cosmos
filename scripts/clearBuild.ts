import { globAsync, packages, rimrafAsync, done } from './shared';

(async () => {
  const pkgPaths = `{${packages.map(p => p.path).join(',')}}`;
  const distPaths = (await globAsync(`./${pkgPaths}/dist`)) as string[];
  await Promise.all(distPaths.map(p => rimrafAsync(p)));
  console.log(done(`Cleared all build files.`));
})();

// @flow

import { join } from 'path';
import {
  globAsync,
  getNodePackages,
  getFormattedPackageList,
  done,
  error
} from './shared';

run();

const BABEL_RUNTIME = '@babel/runtime-corejs2';

async function run() {
  const nodePackages = await getNodePackages();
  const pkgs = await globAsync(
    `./packages/{${nodePackages.join(',')}}/package.json`
  );
  const pkgsWithoutRuntime = [];

  pkgs.forEach(pkgPath => {
    const pkg = require(join(__dirname, '..', pkgPath));
    const { name, dependencies = {} } = pkg;

    if (!dependencies[BABEL_RUNTIME]) {
      pkgsWithoutRuntime.push(name);
    }
  });

  if (pkgsWithoutRuntime.length === 0) {
    console.log(done(`Runtime Babel deps found`));
  } else {
    console.log(
      error(
        `${BABEL_RUNTIME} dependency missing in packages:${getFormattedPackageList(
          pkgsWithoutRuntime
        )}`
      )
    );
    process.exit(1);
  }
}

// @flow

import { spawn } from 'child-process-promise';
import { join } from 'path';
import { bold, italic } from 'chalk';
import cpy from 'cpy';
import {
  AS_IS_PACKAGES,
  getNodePackages,
  getBrowserPackages,
  getFormattedPackageList,
  getUnnamedArg,
  getBoolArg,
  done,
  error
} from './shared';

const { stdout, stderr } = process;

// NOTE: The watch flag is used as a global in this script
const watch = getBoolArg('watch');

run();

async function run() {
  const nodePackages = await getNodePackages();
  const browserPackages = await getBrowserPackages();
  const buildablePackages = [...nodePackages, ...browserPackages];
  const pkgName = getUnnamedArg();

  if (pkgName) {
    if (typeof pkgName !== 'string') {
      stderr.write(error(`Invalid package name ${bold(String(pkgName))}!\n`));
      return;
    }

    if (AS_IS_PACKAGES.indexOf(pkgName) !== -1) {
      stderr.write(error(`${bold(pkgName)} doesn't require building!\n`));
      return;
    }

    if (buildablePackages.indexOf(pkgName) === -1) {
      stderr.write(
        error(
          `${bold(pkgName)} doesn't exist!\nPackages: ${getFormattedPackageList(
            buildablePackages
          )}`
        )
      );
      return;
    }

    stdout.write(
      `${watch ? 'Build-watching' : 'Building'} ${bold(pkgName)}...\n`
    );

    if (nodePackages.indexOf(pkgName) !== -1) {
      await buildNodePackage(pkgName);
    } else {
      await buildBrowserPackage(pkgName);
    }
  } else {
    if (watch) {
      // The limitation here is that we need to build browser packages after
      // packages compiled with Babel. This doesn't work out of the box because
      // `buildNodePackage` hangs forever in watch mode.
      stderr.write(
        error(
          `Can't build-watch all packages! Run ${italic(
            'build PACKAGE --watch'
          )} for one or more packages (in separate terminals)\n`
        )
      );
      return;
    }

    stdout.write(`Building packages...\n`);
    await Promise.all(nodePackages.map(buildNodePackage));

    stdout.write(`Building browser packages...\n`);
    await Promise.all(browserPackages.map(buildBrowserPackage));

    stdout.write(`Built ${buildablePackages.length} packages successfully.\n`);
  }
}

async function buildNodePackage(pkgName) {
  await copyFlowDefs(pkgName);
  await copyStaticAssets(pkgName);

  await runBuildTask({
    pkgName,
    cmd: 'babel',
    args: getBabelCliArgs(pkgName)
  });
}

async function buildBrowserPackage(pkgName) {
  return runBuildTask({
    pkgName,
    cmd: 'webpack',
    args: getWebpackCliArgs(pkgName),
    env: { NODE_ENV: watch ? 'development' : 'production' }
  });
}

type BuildTaskArgs = {
  pkgName: string,
  cmd: string,
  args: string[],
  env?: Object
};

async function runBuildTask({ pkgName, cmd, args, env = {} }: BuildTaskArgs) {
  const promise = spawn(cmd, args, {
    cwd: join(__dirname, '..'),
    env: {
      ...process.env,
      ...env
    }
  });
  const { childProcess } = promise;

  childProcess.stdout.on('data', data => {
    stdout.write(data);
  });

  childProcess.stderr.on('data', data => {
    stderr.write(data);
  });

  childProcess.on('close', code => {
    if (code) {
      stderr.write(error(`${bold(pkgName)}\n`));
    } else {
      stdout.write(done(`${bold(pkgName)}\n`));
    }
  });

  return promise;
}

function getBabelCliArgs(pkgName) {
  let args = [
    `packages/${pkgName}/src`,
    '--out-dir',
    `packages/${pkgName}/dist`,
    '--ignore',
    getPackageIgnorePaths(pkgName).join(',')
  ];

  // Showing Babel output in watch mode because it's nice to get a confirmation
  // that something happened after saving a file
  if (watch) {
    args = [...args, '--watch'];
  } else {
    args = [...args, '--quiet'];
  }

  return args;
}

function getWebpackCliArgs(pkgName) {
  let args = ['--config', `packages/${pkgName}/webpack.config.js`];

  // Showing webpack output in watch mode because it's nice to get a confirmation
  // that something happened after saving a file
  if (watch) {
    args = [...args, '--watch'];
  } else {
    args = [...args, '--silent'];
  }

  return args;
}

function getPackageIgnorePaths(pkgName) {
  const ignore = ['**/__tests__/**', '**/__mocks__/**', '**/jestHelpers/**'];

  if (pkgName === 'react-cosmos-voyager') {
    return [...ignore, '**/use-cases/**'];
  }

  return ignore;
}

async function copyFlowDefs(pkgName) {
  return cpy('**/*.js.flow', `../dist`, {
    cwd: join(__dirname, `../packages/${pkgName}/src`),
    parents: true
  });
}

async function copyStaticAssets(pkgName) {
  if (pkgName === 'react-cosmos') {
    return cpy('src/server/shared/static/**', `dist/server/shared/static`, {
      cwd: join(__dirname, `../packages/react-cosmos`),
      parents: false
    });
  }
}

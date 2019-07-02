import { spawn } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import cpy from 'cpy';
import {
  NODE_PACKAGES,
  BROWSER_PACKAGES,
  getFormattedPackageList,
  getUnnamedArg,
  getBoolArg,
  done,
  error,
  rimrafAsync
} from './shared';

const { stdout, stderr } = process;

const BUILD_ORDER = [
  'react-cosmos-shared2',
  'react-cosmos-fixture',
  'react-cosmos-playground2',
  'react-cosmos'
];

const SOURCE_IGNORE_PATHS = [
  '**/@types/**/*',
  '**/__tests__/**/*',
  '**/__mocks__/**/*',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/testHelpers/**'
];

const watch = getBoolArg('watch');

(async () => {
  const buildablePackages = [...NODE_PACKAGES, ...BROWSER_PACKAGES];
  // TODO: Allow shorthand names (shared => react-cosmos-shared2, etc.)
  const pkgName = getUnnamedArg();

  if (pkgName) {
    if (typeof pkgName !== 'string') {
      stderr.write(
        error(`Invalid package name ${chalk.bold(String(pkgName))}!\n`)
      );
      process.exit(1);
      return;
    }

    if (buildablePackages.indexOf(pkgName) === -1) {
      stderr.write(
        error(
          `${chalk.bold(
            pkgName
          )} doesn't exist!\nPackages: ${getFormattedPackageList(
            buildablePackages
          )}\n`
        )
      );
      process.exit(1);
      return;
    }

    stdout.write(
      `${watch ? 'Build-watching' : 'Building'} ${chalk.bold(pkgName)}...\n`
    );

    if (watch) {
      await watchPackage(pkgName);
    } else {
      await buildPackage(pkgName);
    }
  } else {
    if (watch) {
      // The limitation here is that we need to build browser packages after
      // packages compiled with Babel. This doesn't work out of the box because
      // `buildNodePackage` hangs forever in watch mode.
      stderr.write(
        error(
          `Can't build-watch all packages! Run ${chalk.italic(
            'build PACKAGE --watch'
          )} for one or more packages (in separate terminals)\n`
        )
      );
      process.exit(1);
      return;
    }

    // Packages are built serially because they depend on each other and
    // this way TypeScript ensures their interfaces are compatible
    for (const curPkgName of BUILD_ORDER) {
      await buildPackage(curPkgName);
    }

    stdout.write(`Built ${buildablePackages.length} packages successfully.\n`);
  }
})();

async function buildPackage(pkgName: string) {
  try {
    isBrowserPackage(pkgName)
      ? await buildBrowserPackage(pkgName)
      : await buildNodePackage(pkgName);
    stdout.write(done(`${chalk.bold(pkgName)}\n`));
  } catch (err) {
    stderr.write(error(`${chalk.bold(pkgName)}\n`));
  }
}

async function watchPackage(pkgName: string) {
  return isBrowserPackage(pkgName)
    ? watchBrowserPackage(pkgName)
    : watchNodePackage(pkgName);
}

async function buildNodePackage(pkgName: string) {
  await clearPreviousBuild(pkgName);
  await copyStaticAssets(pkgName);
  await Promise.all([
    await buildNodePackageSource(pkgName),
    await buildPackageHeaders(pkgName)
  ]);
}

async function watchNodePackage(pkgName: string) {
  await clearPreviousBuild(pkgName);
  await copyStaticAssets(pkgName);
  // Don't await on returned promises because watch tasks hang indefinitely
  watchNodePackageSource(pkgName);
  watchPackageHeaders(pkgName);
}

async function buildBrowserPackage(pkgName: string) {
  await Promise.all([
    await buildBrowserPackageSource(pkgName),
    await buildPackageHeaders(pkgName)
  ]);
}

async function watchBrowserPackage(pkgName: string) {
  // Don't await on returned promises because watch tasks hang indefinitely
  watchBrowserPackageSource(pkgName);
  watchPackageHeaders(pkgName);
}

function buildNodePackageSource(pkgName: string) {
  const args = [
    `packages/${pkgName}/src`,
    '--out-dir',
    `packages/${pkgName}/dist`,
    '--extensions',
    '.ts,.tsx',
    '--ignore',
    SOURCE_IGNORE_PATHS.join(',')
  ];
  return runAsyncTask({ cmd: 'babel', args });
}

function watchNodePackageSource(pkgName: string) {
  const args = [
    `packages/${pkgName}/src`,
    '--out-dir',
    `packages/${pkgName}/dist`,
    '--extensions',
    '.ts,.tsx',
    '--ignore',
    SOURCE_IGNORE_PATHS.join(','),
    '--watch'
  ];
  return runAsyncTask({ cmd: 'babel', args });
}

async function buildBrowserPackageSource(pkgName: string) {
  const args = [
    '--config',
    `packages/${pkgName}/webpack.config.js`,
    '--display',
    'errors-only'
  ];
  const env = { NODE_ENV: 'production' };
  return runAsyncTask({ cmd: 'webpack', args, env });
}

async function watchBrowserPackageSource(pkgName: string) {
  // Showing webpack output in watch mode because it's nice to get feedback
  // after saving a file
  const args = ['--config', `packages/${pkgName}/webpack.config.js`, '--watch'];
  const env = { NODE_ENV: 'development' };
  return runAsyncTask({ cmd: 'webpack', args, env });
}

function buildPackageHeaders(pkgName: string) {
  const args = ['-b', `packages/${pkgName}/tsconfig.build.json`];
  return runAsyncTask({ cmd: 'tsc', args });
}

function watchPackageHeaders(pkgName: string) {
  const args = ['-b', `packages/${pkgName}/tsconfig.build.json`, '--watch'];
  return runAsyncTask({ cmd: 'tsc', args });
}

type RunAsyncTaskArgs = {
  cmd: string;
  args: string[];
  env?: {};
};

function runAsyncTask({ cmd, args, env = {} }: RunAsyncTaskArgs) {
  return new Promise((resolve, reject) => {
    const cp = spawn(cmd, args, {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        ...env
      }
    });
    cp.stdout.on('data', data => {
      stdout.write(data);
    });
    cp.stderr.on('data', data => {
      stderr.write(data);
    });
    cp.on('close', code => {
      if (code) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

async function clearPreviousBuild(pkgName: string) {
  await rimrafAsync(`packages/${pkgName}/dist`);
}

const STATIC_PATH = 'shared/static';

async function copyStaticAssets(pkgName: string) {
  if (pkgName === 'react-cosmos') {
    await cpy(`src/${STATIC_PATH}/**`, `dist/${STATIC_PATH}`, {
      cwd: path.join(__dirname, `../packages/react-cosmos`),
      parents: false
    });
  }
}

function isBrowserPackage(pkgName: string) {
  return BROWSER_PACKAGES.indexOf(pkgName) !== -1;
}

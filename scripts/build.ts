import chalk from 'chalk';
import { spawn } from 'child_process';
import cpy from 'cpy';
import path from 'path';
import { generatePlaygroundPluginEntry } from './generatePlaygroundPluginEntry';
import {
  done,
  error,
  findPackage,
  getBoolArg,
  getFormattedPackageList,
  getUnnamedArg,
  Package,
  packages,
  PackageType,
  rimrafAsync,
} from './shared';

const { stdout, stderr } = process;

const SOURCE_IGNORE_PATHS = [
  '**/@types/**/*',
  '**/__tests__/**/*',
  '**/__mocks__/**/*',
  '**/__fixtures__/**/*',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.fixture.ts',
  '**/*.fixture.tsx',
  '**/testHelpers/**',
];

const watch = getBoolArg('watch');

(async () => {
  const pkgName = getUnnamedArg();

  if (pkgName) {
    if (typeof pkgName !== 'string') {
      stderr.write(
        error(`Invalid package name ${chalk.bold(String(pkgName))}!\n`)
      );
      process.exit(1);
      return;
    }

    const pkg = findPackage(pkgName);
    if (!pkg) {
      stderr.write(
        error(
          `${chalk.bold(
            pkgName
          )} doesn't exist!\nPackages: ${getFormattedPackageList()}\n`
        )
      );
      process.exit(1);
      return;
    }

    stdout.write(
      `${watch ? 'Build-watching' : 'Building'} ${chalk.bold(pkg.name)}...\n`
    );

    if (watch) {
      await watchPackage(pkg);
    } else {
      await buildPackage(pkg);
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
    for (const pkg of packages) {
      await buildPackage(pkg);
    }

    stdout.write(`Built ${packages.length} packages successfully.\n`);
  }
})();

async function buildPackage(pkg: Package) {
  try {
    pkg.type === PackageType.Browser
      ? await buildBrowserPackage(pkg)
      : await buildNodePackage(pkg);
    stdout.write(done(`${chalk.bold(pkg.name)}\n`));
  } catch (err) {
    stderr.write(error(`${chalk.bold(pkg.name)}\n`));
  }
}

async function watchPackage(pkg: Package) {
  return pkg.type === PackageType.Browser
    ? watchBrowserPackage(pkg)
    : watchNodePackage(pkg);
}

async function buildNodePackage(pkg: Package) {
  await clearPreviousBuild(pkg);
  await copyStaticAssets(pkg);
  await Promise.all([
    await buildNodePackageSource(pkg),
    await buildPackageHeaders(pkg),
  ]);
}

async function watchNodePackage(pkg: Package) {
  await clearPreviousBuild(pkg);
  await copyStaticAssets(pkg);
  // Don't await on returned promises because watch tasks hang indefinitely
  watchNodePackageSource(pkg);
  watchPackageHeaders(pkg);
}

async function buildBrowserPackage(pkg: Package) {
  await clearPreviousBuild(pkg);
  if (pkg.name === 'react-cosmos-playground2')
    await generatePlaygroundPluginEntry();
  await Promise.all([
    await buildBrowserPackageSource(pkg),
    await buildPackageHeaders(pkg),
  ]);
}

async function watchBrowserPackage(pkg: Package) {
  await clearPreviousBuild(pkg);
  // Don't await on returned promises because watch tasks hang indefinitely
  watchBrowserPackageSource(pkg);
  watchPackageHeaders(pkg);
}

function buildNodePackageSource(pkg: Package) {
  const args = [
    `packages/${pkg.name}/src`,
    '--out-dir',
    `packages/${pkg.name}/dist`,
    '--extensions',
    '.ts,.tsx',
    '--ignore',
    SOURCE_IGNORE_PATHS.join(','),
  ];
  return runAsyncTask({ cmd: 'babel', args });
}

function watchNodePackageSource(pkg: Package) {
  const args = [
    `packages/${pkg.name}/src`,
    '--out-dir',
    `packages/${pkg.name}/dist`,
    '--extensions',
    '.ts,.tsx',
    '--ignore',
    SOURCE_IGNORE_PATHS.join(','),
    '--watch',
  ];
  return runAsyncTask({ cmd: 'babel', args });
}

async function buildBrowserPackageSource(pkg: Package) {
  const args = [
    '--config',
    `packages/${pkg.name}/webpack.config.js`,
    '--display',
    'errors-only',
  ];
  const env = { NODE_ENV: 'production' };
  return runAsyncTask({ cmd: 'webpack', args, env });
}

async function watchBrowserPackageSource(pkg: Package) {
  // Showing webpack output in watch mode because it's nice to get feedback
  // after saving a file
  const args = [
    '--config',
    `packages/${pkg.name}/webpack.config.js`,
    '--watch',
  ];
  const env = { NODE_ENV: 'development' };
  return runAsyncTask({ cmd: 'webpack', args, env });
}

function buildPackageHeaders(pkg: Package) {
  const args = ['-b', `packages/${pkg.name}/tsconfig.build.json`];
  return runAsyncTask({ cmd: 'tsc', args });
}

function watchPackageHeaders(pkg: Package) {
  const args = ['-b', `packages/${pkg.name}/tsconfig.build.json`, '--watch'];
  return runAsyncTask({ cmd: 'tsc', args });
}

type RunAsyncTaskArgs = {
  cmd: string;
  args: string[];
  env?: {};
};

function runAsyncTask({ cmd, args, env = {} }: RunAsyncTaskArgs) {
  return new Promise<void>((resolve, reject) => {
    const cp = spawn(cmd, args, {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        ...env,
      },
      shell: true,
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

async function clearPreviousBuild(pkg: Package) {
  await rimrafAsync(`packages/${pkg.name}/dist`);
}

const STATIC_PATH = 'shared/static';

async function copyStaticAssets(pkg: Package) {
  if (pkg.name === 'react-cosmos') {
    await cpy(`src/${STATIC_PATH}/**`, `dist/${STATIC_PATH}`, {
      cwd: path.join(__dirname, `../packages/${pkg.name}`),
      parents: false,
    });
  }
}

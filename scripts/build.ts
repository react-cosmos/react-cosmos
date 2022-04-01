import chalk from 'chalk';
import { spawn } from 'child_process';
import cpy from 'cpy';
import path from 'path';
import {
  done,
  error,
  findPackage,
  getBoolArg,
  getFormattedPackageList,
  getUnnamedArg,
  Package,
  packages,
  rimrafAsync,
} from './shared';

const { stdout, stderr } = process;

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
          `${chalk.bold(pkgName)} doesn't exist!\n` +
            `Packages: ${getFormattedPackageList()}\n`
        )
      );
      process.exit(1);
      return;
    }

    const label = watch ? 'Build-watching' : 'Building';
    stdout.write(`${label} ${chalk.bold(pkgName)}...\n`);
    await tryBuildPackage(pkg);
  } else {
    if (watch) {
      stderr.write(
        error(
          `Can't watch-build all packages! Run ${chalk.italic(
            'build PACKAGE --watch'
          )} for one or more packages (in separate terminals)\n`
        )
      );
      process.exit(1);
      return;
    }

    // Packages are built serially because they depend on each other and
    // this way TypeScript ensures their interfaces are compatible
    for (const p of packages) await tryBuildPackage(p);

    stdout.write(`Built ${packages.length} packages successfully.\n`);
  }
})();

async function tryBuildPackage(pkgName: Package) {
  try {
    await buildPackage(pkgName);
    stdout.write(done(`${chalk.bold(pkgName)}\n`));
  } catch (err) {
    stderr.write(error(`${chalk.bold(pkgName)}\n`));
  }
}

async function buildPackage(pkgName: Package) {
  if (pkgName === 'react-cosmos') {
    // await generatePlaygroundPluginEntry();
    await clearPackage(pkgName);
    await copyStaticAssets(pkgName);
    await buildTsPackage(pkgName);
    await runWebpack(`packages/${pkgName}/src/playground/webpack.config.js`);
  } else {
    await clearPackage(pkgName);
    await buildTsPackage(pkgName);
    await runWebpack(`packages/${pkgName}/webpack.config.js`);
  }
}

async function clearPackage(pkgName: string) {
  await rimrafAsync(`packages/${pkgName}/dist`);
}

function buildTsPackage(pkgName: string) {
  return runTypeScript(`packages/${pkgName}/tsconfig.build.json`);
}

function runTypeScript(config: string) {
  const args = ['-b', config];
  if (watch) args.push('--watch');
  const promise = runAsyncTask({ cmd: 'tsc', args });
  return watch ? null : promise;
}

function runWebpack(config: string) {
  const args = ['--config', config];
  // Showing webpack output in watch mode because it's nice to get feedback
  // after saving a file
  if (watch) {
    args.push('--watch');
  } else {
    args.push('--stats', 'errors-only');
  }
  const env = { NODE_ENV: watch ? 'development' : 'production' };
  const promise = runAsyncTask({ cmd: 'webpack', args, env });
  return watch ? null : promise;
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

const STATIC_PATH = 'server/static';

async function copyStaticAssets(pkgName: string) {
  await cpy(`src/${STATIC_PATH}/**`, `dist/${STATIC_PATH}`, {
    cwd: path.join(__dirname, `../packages/${pkgName}`),
    parents: false,
  });
}

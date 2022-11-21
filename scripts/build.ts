import chalk from 'chalk';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import {
  done,
  error,
  findPackage,
  getBoolArg,
  getFormattedPackageList,
  getUnnamedArg,
  Package,
  packages,
} from './shared.js';

const { stdout, stderr } = process;

const watch = getBoolArg('watch');

type Builder = (pkgName: string) => Promise<void>;

const builders: Partial<Record<Package, Builder>> & { default: Builder } = {
  'react-cosmos-core': async pkgName => {
    await buildPkgTs(pkgName, 'tsconfig.build.json');
  },
  'react-cosmos-dom': async pkgName => {
    await buildPkgTs(pkgName, 'tsconfig.build.json');
  },
  'react-cosmos-native': async pkgName => {
    await buildPkgTs(pkgName, 'tsconfig.build.json');
  },
  'react-cosmos-ui': async pkgName => {
    await buildPkgTs(pkgName, 'tsconfig.build.json');
    await buildPkgWebpack(pkgName, 'webpack.config.build.js');
  },
  'react-cosmos': async pkgName => {
    await copyStaticAssets(pkgName);
    await buildPkgTs(pkgName, 'tsconfig.build.json');
  },
  'react-cosmos-plugin-webpack': async pkgName => {
    await buildPkgTs(pkgName, 'tsconfig.build.client.json');
    await buildPkgTs(pkgName, 'tsconfig.build.server.json');
    await fs.copyFile(
      pkgPath(pkgName, 'src/server/webpackConfig/userDepsLoader.cjs'),
      pkgPath(pkgName, 'dist/server/webpackConfig/userDepsLoader.cjs')
    );
    await buildPkgTs(pkgName, 'tsconfig.build.ui.json');
    await buildPkgWebpack(pkgName, 'src/ui/webpack.config.js');
  },
  default: async pkgName => {
    await buildPkgTs(pkgName, 'tsconfig.build.json');
    await buildPkgWebpack(pkgName, 'webpack.config.js');
  },
};

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
    console.log(err);
    stderr.write(error(`${chalk.bold(pkgName)}\n`));
  }
}

async function buildPackage(pkgName: Package) {
  await clearPackage(pkgName);
  const builder = builders[pkgName] || builders.default;
  await builder(pkgName);
}

async function clearPackage(pkgName: string) {
  await fs.rm(`packages/${pkgName}/dist`, { recursive: true, force: true });
}

async function buildPkgTs(pkgName: string, tsConfig: string) {
  await runTypeScript(`packages/${pkgName}/${tsConfig}`);
}

async function buildPkgWebpack(pkgName: string, webpackConfig: string) {
  await runWebpack(`packages/${pkgName}/${webpackConfig}`);
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
  const env = { NODE_ENV: 'development' };
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
    const child = spawn(cmd, args, {
      cwd: new URL('..', import.meta.url).pathname,
      env: {
        ...process.env,
        ...env,
      },
      shell: true,
    });
    child.stdout.on('data', data => {
      stdout.write(data);
    });
    child.stderr.on('data', data => {
      stderr.write(data);
    });
    child.on('close', code => {
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
  const pkgDir = new URL(`../packages/${pkgName}`, import.meta.url).pathname;
  await fs.cp(`${pkgDir}/src/${STATIC_PATH}`, `${pkgDir}/dist/${STATIC_PATH}`, {
    recursive: true,
  });
}

function pkgPath(pkgName: string, relPath: string) {
  return new URL(`../packages/${pkgName}/${relPath}`, import.meta.url).pathname;
}

import chalk from 'chalk';
import fs from 'fs/promises';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import {
  done,
  error,
  findPackage,
  getFormattedPackageList,
  getUnnamedArg,
  Package,
  packages,
} from './shared.js';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';

type TargetDir = typeof SRC_DIR | typeof DIST_DIR;

// These classes need to be defined at the top of this file
// https://stackoverflow.com/a/59171646/128816
class InvalidTargetDir extends Error {
  constructor() {
    super('Invalid target dir!');
  }
}

class InvalidTargetPackage extends Error {
  constructor(targetPackage: string) {
    super(`Invalid package name ${chalk.bold(targetPackage)}!`);
  }
}

(async () => {
  try {
    const targetDir = getTargetDir();
    const targetPackages = getTargetPackages();

    const { modules, configs } = await getPackageEntryPoints(targetPackages);
    await Promise.all(modules.map(f => linkFileRequiresToDir(f, targetDir)));
    await Promise.all(configs.map(f => linkConfigPathsToDir(f, targetDir)));

    console.log(done(`Linked entry points to ${chalk.bold(targetDir)}.`));
  } catch (err) {
    if (err instanceof InvalidTargetDir) {
      console.log(
        error(
          `${err.message}\nAvailable options are ${chalk.bold(
            SRC_DIR
          )} and ${chalk.bold(DIST_DIR)}`
        )
      );
    } else if (err instanceof InvalidTargetPackage) {
      console.log(
        error(`${err.message}\nPackages: ${getFormattedPackageList()}`)
      );
    } else {
      throw err;
    }
  }
})();

async function linkFileRequiresToDir(filePath: string, targetDir: TargetDir) {
  // NOTE: Use static transform + pretty format if future requires it.
  // For now this is JustFine™
  const prevContents = await fs.readFile(filePath, 'utf8');
  const regExp = new RegExp(`'(\\.{1,2})/(${SRC_DIR}|${DIST_DIR})`, 'g');
  const nextContents = prevContents.replace(regExp, `'$1/${targetDir}`);

  await fs.writeFile(filePath, nextContents, 'utf8');
}

async function linkConfigPathsToDir(filePath: string, targetDir: TargetDir) {
  const prev = await fs.readFile(filePath, 'utf8');
  let next = prev;

  if (prev.match(/"main": "/)) {
    if (targetDir === SRC_DIR) {
      const regExp = new RegExp(`"main": "./${DIST_DIR}/(.+).js"`, 'g');
      next = next.replace(regExp, `"main": "./${SRC_DIR}/$1.ts"`);
    } else {
      const regExp = new RegExp(`"main": "./${SRC_DIR}/(.+).ts"`, 'g');
      next = next.replace(regExp, `"main": "./${DIST_DIR}/$1.js"`);
    }
  }

  if (next !== prev) {
    await fs.writeFile(filePath, next, 'utf8');
  }
}

async function getPackageEntryPoints(targetPackages: Package[]): Promise<{
  modules: string[];
  configs: string[];
}> {
  if (targetPackages.length === 0)
    throw new Error('No package entry points to link for empty package list');

  const pkgMatch =
    targetPackages.length > 1
      ? `{${targetPackages.join(',')}}`
      : targetPackages[0];

  const cwd = fileURLToPath(new URL('..', import.meta.url));
  const modules = globSync(`packages/${pkgMatch}/{*,bin/*}.{js,d.ts}`, {
    cwd,
    absolute: true,
    ignore: ['**/webpack.config*.js'],
  });
  const configs = globSync(`packages/${pkgMatch}/package.json`, {
    cwd,
    absolute: true,
  });

  return { modules, configs };
}

function getTargetDir(): TargetDir {
  const targetDir = getUnnamedArg();
  if (!isValidTargetDir(targetDir)) {
    throw new InvalidTargetDir();
  }

  return targetDir;
}

function getTargetPackages(): Package[] {
  let targetPackages: Package[] = [];
  let pkgName = getUnnamedArg(1);

  if (!pkgName) return packages;

  do {
    if (typeof pkgName !== 'string')
      throw new InvalidTargetPackage(String(pkgName));

    const pkg = findPackage(pkgName);
    if (!pkg) throw new InvalidTargetPackage(pkgName);

    targetPackages.push(pkg);
    pkgName = getUnnamedArg(targetPackages.length + 1);
  } while (pkgName);

  return targetPackages;
}

function isValidTargetDir(targetDir: unknown): targetDir is TargetDir {
  return (
    typeof targetDir === 'string' &&
    (targetDir === SRC_DIR || targetDir === DIST_DIR)
  );
}

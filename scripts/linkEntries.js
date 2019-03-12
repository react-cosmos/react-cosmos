// @flow

import { bold } from 'chalk';
import {
  SHARED_TS_PACKAGE,
  globAsync,
  readFileAsync,
  writeFileAsync,
  getTsNodePackages,
  getBabelNodePackages,
  getFormattedPackageList,
  getUnnamedArg,
  done,
  error
} from './shared';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';

type TargetDir = typeof SRC_DIR | typeof DIST_DIR;

run();

async function run() {
  const tsPackages = await getTsNodePackages();
  const nodePackages = await getBabelNodePackages();
  const packages = [SHARED_TS_PACKAGE, ...tsPackages, ...nodePackages];

  try {
    const targetDir = getTargetDir();
    const targetPackages = getTargetPackages(packages);

    const entryPoints = await getPackageEntryPoints(targetPackages);
    await Promise.all(
      entryPoints.map(f => linkFileRequiresToDir(f, targetDir))
    );

    console.log(done(`Linked entry points to ${bold(targetDir)}.`));
  } catch (err) {
    if (err instanceof InvalidTargetDir) {
      console.log(
        error(
          `${err.message}\nAvailable options are ${bold(SRC_DIR)} and ${bold(
            DIST_DIR
          )}`
        )
      );
    } else if (err instanceof InvalidTargetPackage) {
      console.log(
        error(
          `${err.message}\nNode packages: ${getFormattedPackageList(
            nodePackages
          )}`
        )
      );
    } else {
      throw err;
    }
  }
}

async function linkFileRequiresToDir(filePath, targetDir: TargetDir) {
  // NOTE: Use Babel transform + Prettier if future requires it.
  // For now this is JustFine™
  const prevContents = await readFileAsync(filePath, 'utf8');
  const regExp = new RegExp(`'(\\.{1,2})/(${SRC_DIR}|${DIST_DIR})`, 'g');
  const nextContents = prevContents.replace(regExp, `'$1/${targetDir}`);

  writeFileAsync(filePath, nextContents, 'utf8');
}

async function getPackageEntryPoints(packages) {
  if (packages.length === 0) {
    throw new Error('No package entry points to link for empty package list');
  }

  const pkgMatch =
    packages.length > 1 ? `{${packages.join(',')}}` : packages[0];

  return globAsync(`./packages/${pkgMatch}/{*,bin/*}.{js,d.ts}`);
}

function getTargetDir(): TargetDir {
  const targetDir = getUnnamedArg();

  if (
    typeof targetDir === 'string' &&
    (targetDir === SRC_DIR || targetDir === DIST_DIR)
  ) {
    return targetDir;
  }

  throw new InvalidTargetDir();
}

function getTargetPackages(nodePackages): string[] {
  let packages = [];
  let pkg = getUnnamedArg(1);

  if (!pkg) {
    return nodePackages;
  }

  do {
    if (typeof pkg !== 'string' || nodePackages.indexOf(pkg) === -1) {
      throw new InvalidTargetPackage(String(pkg));
    }

    packages = [...packages, pkg];
  } while ((pkg = getUnnamedArg(packages.length + 1)));

  return packages;
}

function InvalidTargetDir() {
  this.name = 'InvalidTargetDir';
  this.message = 'Invalid target dir!';
}

function InvalidTargetPackage(targetPackage) {
  this.name = 'InvalidTargetPackage';
  this.message = `Invalid package name ${bold(targetPackage)}!`;
}

import chalk from 'chalk';
import {
  PackageNames,
  NODE_PACKAGES,
  BROWSER_PACKAGES,
  globAsync,
  readFileAsync,
  writeFileAsync,
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
  const packages = [...NODE_PACKAGES, ...BROWSER_PACKAGES];
  try {
    const targetDir = getTargetDir();
    const targetPackages = getTargetPackages(packages);

    const entryPoints = await getPackageEntryPoints(targetPackages);
    await Promise.all(
      entryPoints.map(f => linkFileRequiresToDir(f, targetDir))
    );

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
        error(
          `${err.message}\nNode packages: ${getFormattedPackageList(packages)}`
        )
      );
    } else {
      throw err;
    }
  }
}

async function linkFileRequiresToDir(filePath: string, targetDir: TargetDir) {
  // NOTE: Use static transform + pretty format if future requires it.
  // For now this is JustFine™
  const prevContents = await readFileAsync(filePath, 'utf8');
  const regExp = new RegExp(`'(\\.{1,2})/(${SRC_DIR}|${DIST_DIR})`, 'g');
  const nextContents = prevContents.replace(regExp, `'$1/${targetDir}`);

  writeFileAsync(filePath, nextContents, 'utf8');
}

async function getPackageEntryPoints(
  packages: PackageNames
): Promise<string[]> {
  if (packages.length === 0) {
    throw new Error('No package entry points to link for empty package list');
  }

  const pkgMatch =
    packages.length > 1 ? `{${packages.join(',')}}` : packages[0];

  return globAsync(`./packages/${pkgMatch}/{*,bin/*}.{js,d.ts}`);
}

function getTargetDir(): TargetDir {
  const targetDir = getUnnamedArg();
  if (!isValidTargetDir(targetDir)) {
    throw new InvalidTargetDir();
  }

  return targetDir;
}

function getTargetPackages(nodePackages: PackageNames): string[] {
  let packages: PackageNames = [];
  let pkg = getUnnamedArg(1);

  if (!pkg) {
    return nodePackages;
  }

  do {
    if (typeof pkg !== 'string' || nodePackages.indexOf(pkg) === -1) {
      throw new InvalidTargetPackage(String(pkg));
    }
    packages = [...packages, pkg];
    pkg = getUnnamedArg(packages.length + 1);
  } while (pkg);

  return packages;
}

function isValidTargetDir(targetDir: unknown): targetDir is TargetDir {
  return (
    typeof targetDir === 'string' &&
    (targetDir === SRC_DIR || targetDir === DIST_DIR)
  );
}

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

import chalk from 'chalk';
import {
  done,
  error,
  findPackage,
  getFormattedPackageList,
  getUnnamedArg,
  globAsync,
  Package,
  packages,
  readFileAsync,
  writeFileAsync,
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
  const prevContents = await readFileAsync(filePath, 'utf8');
  const regExp = new RegExp(`'(\\.{1,2})/(${SRC_DIR}|${DIST_DIR})`, 'g');
  const nextContents = prevContents.replace(regExp, `'$1/${targetDir}`);

  writeFileAsync(filePath, nextContents, 'utf8');
}

async function getPackageEntryPoints(
  targetPackages: Package[]
): Promise<string[]> {
  if (targetPackages.length === 0)
    throw new Error('No package entry points to link for empty package list');

  const pkgMatch =
    targetPackages.length > 1
      ? `{${targetPackages.join(',')}}`
      : targetPackages[0];

  return globAsync(`./packages/${pkgMatch}/{*,bin/*}.{js,d.ts}`);
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

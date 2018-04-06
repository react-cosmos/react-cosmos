// @flow

import { bold } from 'chalk';
import {
  globAsync,
  readFileAsync,
  writeFileAsync,
  getNodePackages,
  getUnnamedArg,
  successText,
  errorText
} from './shared';

const SRC_DIR = 'src';
const DIST_DIR = 'dist';

type TargetDir = typeof SRC_DIR | typeof DIST_DIR;

run();

async function run() {
  try {
    const targetDir = getTargetDir();
    const nodePackages = await getNodePackages();
    const entryPoints = await getPackageEntryPoints(nodePackages);
    await Promise.all(
      entryPoints.map(f => linkFileRequiresToDir(f, targetDir))
    );

    console.log(
      successText(' DONE ') + ` Linked entry points to ${bold(targetDir)}.`
    );
  } catch (err) {
    if (err instanceof InvalidTargetDir) {
      console.log(
        errorText(' ERROR ') +
          ` ${err.message} Available options are ${bold(SRC_DIR)} and ${bold(
            DIST_DIR
          )}`
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
  const regExp = new RegExp(`require\\('./(${SRC_DIR}|${DIST_DIR})`, 'g');
  const nextContents = prevContents.replace(regExp, `require('./${targetDir}`);

  writeFileAsync(filePath, nextContents, 'utf8');
}

async function getPackageEntryPoints(packages) {
  return globAsync(`./packages/{${packages.join(',')}}/*.js`);
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

export function InvalidTargetDir() {
  this.name = 'InvalidTargetDir';
  this.message = 'Invalid target dir!';
}

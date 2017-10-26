// @flow

import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import { extractComponentsFromFixtureFile } from './extract-components-from-fixture-file';

import type { FixtureFile } from '../types';

const globAsync = promisify(glob);

type ExcludePattern = string | RegExp;

type Args = ?{
  fileMatch?: Array<string>,
  exclude?: ExcludePattern | Array<ExcludePattern>,
  cwd?: string
};

const defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx}',
  '**/?(*.)fixture?(s).{js,jsx}'
];

const defaultExclude = [];

/**
 * Search the user code for fixture files.
 */
export async function findFixtureFiles(
  args: Args
): Promise<Array<FixtureFile>> {
  const {
    fileMatch = defaultFileMatch,
    exclude = defaultExclude,
    cwd = process.cwd()
  } =
    args || {};

  const excludeList = Array.isArray(exclude) ? exclude : [exclude];
  const allPaths = await globAsync('**/*', {
    cwd,
    absolute: true,
    ignore: '**/node_modules/**'
  });
  const fixturePaths = micromatch(allPaths, fileMatch);
  const fixtureFiles = [];

  // Can't use forEach because we want each (async) loop to be serial
  for (let i = 0; i < fixturePaths.length; i++) {
    const filePath = fixturePaths[i];

    if (excludeList.some(excludePattern => filePath.match(excludePattern))) {
      continue;
    }

    const components = await extractComponentsFromFixtureFile(filePath);

    fixtureFiles.push({
      filePath,
      components
    });
  }

  return fixtureFiles;
}

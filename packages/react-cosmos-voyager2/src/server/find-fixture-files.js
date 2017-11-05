// @flow

import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import { extractComponentsFromFixtureFile } from './extract-components-from-fixture-file';

import type { ExcludePatterns } from 'react-cosmos-shared/src/types';
import type { FixtureFile } from '../types';

const globAsync = promisify(glob);

type Args = ?{
  rootPath?: string,
  fileMatch?: Array<string>,
  exclude?: ExcludePatterns
};

const defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
  '**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
];

const defaultExclude = [];

/**
 * Search the user code for fixture files.
 */
export async function findFixtureFiles(
  args: Args
): Promise<Array<FixtureFile>> {
  const {
    rootPath = process.cwd(),
    fileMatch = defaultFileMatch,
    exclude = defaultExclude
  } =
    args || {};

  const excludeList = Array.isArray(exclude) ? exclude : [exclude];
  const allPaths = await globAsync('**/*', {
    cwd: rootPath,
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

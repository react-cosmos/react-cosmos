// @flow

import glob from 'glob';
import micromatch from 'micromatch';
import promisify from 'util.promisify';
import { defaultFileMatch, defaultExclude } from 'react-cosmos-shared/server';
import { extractComponentsFromFixtureFile } from './extract-components-from-fixture-file';

import type { ExcludePatterns } from 'react-cosmos-flow/config';
import type { FixtureFile } from 'react-cosmos-flow/module';

const globAsync = promisify(glob);

type Args = ?{
  rootPath?: string,
  fileMatch?: Array<string>,
  exclude?: ExcludePatterns
};

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
  const fixturePaths = micromatch(allPaths, fileMatch, { dot: true });
  const fixtureFiles = [];

  // Can't use forEach because we want each (async) loop to be serial
  for (let i = 0; i < fixturePaths.length; i++) {
    const filePath = fixturePaths[i];

    if (excludeList.some(excludePattern => filePath.match(excludePattern))) {
      continue;
    }

    const components = await extractComponentsFromFixtureFile(
      filePath,
      rootPath
    );

    fixtureFiles.push({
      filePath,
      components
    });
  }

  return fixtureFiles;
}

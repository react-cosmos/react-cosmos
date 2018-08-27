// @flow

import { slash } from 'react-cosmos-shared/server';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

describe('ES module / Exclude option (list)', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: slash(__dirname, '__fsmocks__'),
      exclude: [/ignored-dir/, /ignored-file/]
    });
  });

  it('only finds file that does not match exclude patterns', () => {
    expect(files).toHaveLength(1);
    expect(files[0].filePath).toEqual(slash(resolve('./__fsmocks__/fixture')));
  });
});

describe('ES module / Exclude option (single)', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: slash(__dirname, '__fsmocks__'),
      exclude: /(ignored-dir|ignored-file)/
    });
  });

  it('only finds file that does not match exclude patterns', () => {
    expect(files).toHaveLength(1);
    expect(files[0].filePath).toEqual(slash(resolve('./__fsmocks__/fixture')));
  });
});

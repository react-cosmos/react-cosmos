// @flow

import { slash } from 'react-cosmos-shared/server';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

// We test for edge cases to make sure we degrade gracefully
describe('ES module / Single fixture with anonymous component', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: slash(__dirname, '__fsmocks__')
    });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(slash(resolve('./__fsmocks__/fixture')));
  });

  it('has component name', () => {
    expect(files[0].components[0].name).toBe(null);
  });

  it('has component path', () => {
    expect(files[0].components[0].filePath).toBe(null);
  });
});

// @flow

import { slash } from 'react-cosmos-shared/server';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

describe('ES module / Multi fixture', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: slash(__dirname, '__fsmocks__')
    });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(slash(resolve('./__fsmocks__/fixtures')));
  });

  it('has component names', () => {
    expect(files[0].components[0].name).toBe('Bold');
    expect(files[0].components[1].name).toBe('Bold');
    expect(files[0].components[2].name).toBe('Italic');
  });

  it('has component paths', () => {
    expect(files[0].components[0].filePath).toBe(
      slash(resolve('./__fsmocks__/Bold'))
    );
    expect(files[0].components[1].filePath).toBe(
      slash(resolve('./__fsmocks__/Bold'))
    );
    expect(files[0].components[2].filePath).toBe(
      slash(resolve('./__fsmocks__/Italic'))
    );
  });
});

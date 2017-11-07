// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

describe('ES module / Single fixture', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: join(__dirname, '__fsmocks__')
    });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(resolve('./__fsmocks__/fixture'));
  });

  it('has component name', () => {
    expect(files[0].components[0].name).toBe('Italic');
  });

  it('has component path', () => {
    expect(files[0].components[0].filePath).toBe(
      resolve('./__fsmocks__/Italic')
    );
  });
});

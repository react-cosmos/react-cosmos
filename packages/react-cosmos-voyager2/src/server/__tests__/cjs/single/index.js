// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../findFixtureFiles';

const { resolve } = require;

// TODO: CJS support
describe.skip('CJS module / Single fixture', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({ cwd: join(__dirname, '__fsMocks__') });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(resolve('./__fsMocks__/fixture'));
  });

  it('has component name', () => {
    expect(files[0].components[0].name).toBe('Italic');
  });

  it('has component path', () => {
    expect(files[0].components[0].filePath).toBe(
      resolve('./__fsMocks__/Italic')
    );
  });
});

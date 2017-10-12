// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../findFixtureFiles';

const { resolve } = require;

describe('ES module / Multi fixture', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({ cwd: join(__dirname, '__fsMocks__') });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(resolve('./__fsMocks__/fixtures'));
  });

  it('has component names', () => {
    expect(files[0].components[0].name).toBe('Bold');
    expect(files[0].components[1].name).toBe('Bold');
    expect(files[0].components[2].name).toBe('Italic');
  });

  it('has component paths', () => {
    expect(files[0].components[0].filePath).toBe(resolve('./__fsMocks__/Bold'));
    expect(files[0].components[1].filePath).toBe(resolve('./__fsMocks__/Bold'));
    expect(files[0].components[2].filePath).toBe(
      resolve('./__fsMocks__/Italic')
    );
  });
});

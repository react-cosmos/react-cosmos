// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../findFixtureFiles';

const { resolve } = require;

// We test for edge cases to make sure we degrade gracefully
describe('ES module / Single fixture with anonymous component', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({ cwd: join(__dirname, '__fsMocks__') });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(resolve('./__fsMocks__/fixture'));
  });

  it('has component name', () => {
    expect(files[0].components[0].name).toBe(null);
  });

  it('has component path', () => {
    expect(files[0].components[0].filePath).toBe(null);
  });
});

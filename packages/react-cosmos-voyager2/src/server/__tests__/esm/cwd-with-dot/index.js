// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

describe('ES module / Current working directory path includes "."', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: join(__dirname, '.fsmocks')
    });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(resolve('./.fsmocks/fixture'));
  });

  it('has component name', () => {
    expect(files[0].components[0].name).toBe('Italic');
  });

  it('has component path', () => {
    expect(files[0].components[0].filePath).toBe(resolve('./.fsmocks/Italic'));
  });
});

// @flow

import { slash } from 'react-cosmos-shared/server';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

describe('ES module / Current working directory path includes "."', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: slash(__dirname, '.dot/__fsmocks__')
    });
  });

  it('has fixture path', () => {
    expect(files[0].filePath).toBe(
      slash(resolve('./.dot/__fsmocks__/fixture'))
    );
  });

  it('has component name', () => {
    expect(files[0].components[0].name).toBe('Italic');
  });

  it('has component path', () => {
    expect(files[0].components[0].filePath).toBe(
      slash(resolve('./.dot/__fsmocks__/Italic'))
    );
  });
});

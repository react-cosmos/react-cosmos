// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

describe('ES module / Multi fixture with vars', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({
      rootPath: join(__dirname, '__fsmocks__')
    });
  });

  describe('joined list var', () => {
    it('has fixture path', () => {
      expect(files[0].filePath).toBe(resolve('./__fsmocks__/joined.fixture'));
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

  describe('separate object vars', () => {
    it('has fixture path', () => {
      expect(files[1].filePath).toBe(resolve('./__fsmocks__/separate.fixture'));
    });

    it('has component name', () => {
      expect(files[1].components[0].name).toBe('Italic');
    });

    it('has component path', () => {
      expect(files[1].components[0].filePath).toBe(
        resolve('./__fsmocks__/Italic')
      );
    });
  });
});

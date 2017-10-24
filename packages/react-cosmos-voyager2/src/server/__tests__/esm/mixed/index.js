// @flow

import { join } from 'path';
import { findFixtureFiles } from '../../../find-fixture-files';

const { resolve } = require;

// Warning: The fact that `fixture.js` is read before `fixtures.js` is an
// assumption in this test. We do not explictly control the order of the
// fixture files at the moment.
describe('ES module / Single + multi fixture', () => {
  let files;

  beforeEach(async () => {
    files = await findFixtureFiles({ cwd: join(__dirname, '__fsmocks__') });
  });

  describe('file 1', () => {
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

  describe('file 2', () => {
    it('has fixture path', () => {
      expect(files[1].filePath).toBe(resolve('./__fsmocks__/fixtures'));
    });

    it('has component names', () => {
      expect(files[1].components[0].name).toBe('Bold');
      expect(files[1].components[1].name).toBe('Bold');
      expect(files[1].components[2].name).toBe('Italic');
    });

    it('has component paths', () => {
      expect(files[1].components[0].filePath).toBe(
        resolve('./__fsmocks__/Bold')
      );
      expect(files[1].components[1].filePath).toBe(
        resolve('./__fsmocks__/Bold')
      );
      expect(files[1].components[2].filePath).toBe(
        resolve('./__fsmocks__/Italic')
      );
    });
  });
});

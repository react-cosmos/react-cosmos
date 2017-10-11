// @flow

import path from 'path';
import { getComponents } from '../getComponents';
import Italics from './fileMocks/funcComponentNamed/Italics';

describe('Named functional component', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/funcComponentNamed')
    });
  });

  it('infers component name', () => {
    expect(components[0].name).toBe('Italics');
  });

  it('references component type', () => {
    expect(components[0].type).toBe(Italics);
  });
});

// @flow

import path from 'path';
import { getComponents } from '../getComponents';
import UnnamedClass from './fileMocks/componentsUnnamedCjs/components/UnnamedClass';
import UnnamedFunction from './fileMocks/componentsUnnamedCjs/components/UnnamedFunction';

// Fixture analysis for CJS modules isn't supported yet
describe.skip('Unnamed CJS component modules', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/componentsUnnamedCjs')
    });
  });

  it('has default "Component" component name', () => {
    expect(components[0].name).toBe('Component');
  });

  it('has default "Component (1)" component name', () => {
    expect(components[1].name).toBe('Component (1)');
  });

  it('has inferred component name', () => {
    expect(components[2].name).toBe('UnnamedClass');
  });

  it('has inferred component name', () => {
    expect(components[3].name).toBe('UnnamedFunction');
  });

  // Component 1 & 2 are declared annonymously so they can't be tested against
  // an external reference

  it('references component type', () => {
    expect(components[2].type).toBe(UnnamedClass);
  });

  it('references component type', () => {
    expect(components[3].type).toBe(UnnamedFunction);
  });
});

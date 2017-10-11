// @flow

import path from 'path';
import { getComponents } from '../getComponents';

// Checking the order of components if irrelevant in this these tests,
// so we target component by name instead
function getComponentByName(components, compName) {
  const comp = components.find(c => c.name === compName);
  if (!comp) {
    throw new Error(`Could not find component ${compName}`);
  }

  return comp;
}

describe('Component custom namespace', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/componentNamespaceCustom')
    });
  });

  it('has "" namespace', () => {
    const app = getComponentByName(components, 'App');
    expect(app.namespace).toBe('');
  });

  it('has "Header" namespace', () => {
    const hello = getComponentByName(components, 'Hello');
    expect(hello.namespace).toBe('Header');
  });

  it('has "Header/User" namespace', () => {
    const guest = getComponentByName(components, 'Guest');
    const loggedIn = getComponentByName(components, 'LoggedIn');
    expect(guest.namespace).toBe('Header/User');
    expect(loggedIn.namespace).toBe('Header/User');
  });
});

// @flow

import path from 'path';
import { getComponents } from '../getComponents';

describe('Named single fixture file', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/singleNamed')
    });
  });

  it('has custom fixture name', () => {
    expect(components[0].fixtures[0].name).toBe('foo fixture');
  });

  it('has fixture path', () => {
    expect(components[0].fixtures[0].filePath).toBe(
      require.resolve('./fileMocks/singleNamed/fixture')
    );
  });

  it('has null fixtureIndex', () => {
    expect(components[0].fixtures[0].fixtureIndex).toBe(null);
  });
});

// @flow

import path from 'path';
import { getComponents } from '../getComponents';
import Italics from './fileMocks/singleUnnamed/Italics';

describe('Unnamed single fixture file', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/singleUnnamed')
    });
  });

  it('has "default" fixture name', () => {
    expect(components[0].fixtures[0].name).toBe('default');
  });

  it('has fixture path', () => {
    expect(components[0].fixtures[0].filePath).toBe(
      require.resolve('./fileMocks/singleUnnamed/fixture')
    );
  });

  it('has null fixtureIndex', () => {
    expect(components[0].fixtures[0].fixtureIndex).toBe(null);
  });
});

// @flow

import path from 'path';
import { getComponents } from '../getComponents';

describe('More unnamed single fixture files', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/singlesUnnamed')
    });
  });

  it('has "default" name', () => {
    expect(components[0].fixtures[0].name).toBe('default');
  });

  it('has "default (1)" name', () => {
    expect(components[0].fixtures[1].name).toBe('default (1)');
  });
});

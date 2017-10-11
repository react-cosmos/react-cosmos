// @flow

import path from 'path';
import { getComponents } from '../getComponents';

describe('Component paths', () => {
  let components;

  beforeEach(async () => {
    components = await getComponents({
      cwd: path.join(__dirname, 'fileMocks/componentPaths')
    });
  });

  it('detects path for external component', () => {
    expect(components[0].filePath).toBe(
      require.resolve('./fileMocks/componentPaths/Bold')
    );
  });

  it('detects path for external component', () => {
    expect(components[2].filePath).toBe(
      require.resolve('./fileMocks/componentPaths/Italics')
    );
  });

  it('sets null path for inlined component', () => {
    expect(components[1].filePath).toBe(null);
  });
});

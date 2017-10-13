// @flow

import { getComponents } from '../getComponents';

describe('Single component defaults', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/path/to/foo.js': {
        component: () => {}
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has default name', () => {
    expect(components[0].name).toBe('Component');
  });

  it('has null path', () => {
    expect(components[0].filePath).toBe(null);
  });
});

describe('Multi component defaults', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/path/to/foo.js': [
        {
          component: () => {}
        },
        {
          component: () => {}
        },
        {
          component: () => {}
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has default name', () => {
    expect(components[0].name).toBe('Component');
  });

  it('has null path', () => {
    expect(components[0].filePath).toBe(null);
  });

  it('has default name', () => {
    expect(components[1].name).toBe('Component (1)');
  });

  it('has null path', () => {
    expect(components[1].filePath).toBe(null);
  });

  it('has default name', () => {
    expect(components[2].name).toBe('Component (2)');
  });

  it('has null path', () => {
    expect(components[2].filePath).toBe(null);
  });
});

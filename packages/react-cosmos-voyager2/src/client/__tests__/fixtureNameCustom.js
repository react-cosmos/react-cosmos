// @flow

import { getComponents } from '../getComponents';

const Comp = () => {};

describe('Custom name for single fixture', () => {
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
        name: 'fu fu',
        component: Comp
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has name', () => {
    expect(components[0].fixtures[0].name).toBe('fu fu');
  });
});

describe('Custom names for multi fixture', () => {
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
          name: 'fu fu 1',
          component: Comp
        },
        {
          name: 'fu fu 2',
          component: Comp
        },
        {
          name: 'fu fu 3',
          component: Comp
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has name', () => {
    expect(components[0].fixtures[0].name).toBe('fu fu 1');
  });

  it('has name', () => {
    expect(components[0].fixtures[1].name).toBe('fu fu 2');
  });

  it('has name', () => {
    expect(components[0].fixtures[2].name).toBe('fu fu 3');
  });
});

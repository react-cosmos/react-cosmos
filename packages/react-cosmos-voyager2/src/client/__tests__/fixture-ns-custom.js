// @flow

import { getComponents } from '../get-components';

const Comp = () => {};

describe('Custom namespace for one fixture', () => {
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
        namespace: 'bar',
        component: Comp
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has custom namespace', () => {
    expect(components[0].fixtures[0].namespace).toBe('bar');
  });
});

describe('Custom namespace for more fixtures', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to1/foo.js',
        components: []
      },
      {
        filePath: '/path/to2/foo.js',
        components: []
      },
      {
        filePath: '/path/to3/foo.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/path/to1/foo.js': [
        {
          component: Comp,
          namespace: 'bar1'
        }
      ],
      '/path/to2/foo.js': [
        {
          component: Comp,
          namespace: 'bar2'
        }
      ],
      '/path/to3/foo.js': [
        {
          component: Comp,
          namespace: 'bar3'
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has custom namespace', () => {
    expect(components[0].fixtures[0].namespace).toBe('bar1');
  });

  it('has custom namespace', () => {
    expect(components[0].fixtures[1].namespace).toBe('bar2');
  });

  it('has custom namespace', () => {
    expect(components[0].fixtures[2].namespace).toBe('bar3');
  });
});

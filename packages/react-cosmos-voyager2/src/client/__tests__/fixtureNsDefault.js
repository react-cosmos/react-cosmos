// @flow

import { getComponents } from '../getComponents';

const Comp = () => {};

describe('Default namespace for one fixture', () => {
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
        component: Comp
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has empty namespace', () => {
    expect(components[0].fixtures[0].namespace).toBe('');
  });
});

describe('Default namespace for more fixtures', () => {
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
          component: Comp
        }
      ],
      '/path/to2/foo.js': [
        {
          component: Comp
        }
      ],
      '/path/to3/foo.js': [
        {
          component: Comp
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has namespace from file path', () => {
    expect(components[0].fixtures[0].namespace).toBe('to1');
  });

  it('has namespace from file path', () => {
    expect(components[0].fixtures[1].namespace).toBe('to2');
  });

  it('has namespace from file path', () => {
    expect(components[0].fixtures[2].namespace).toBe('to3');
  });
});

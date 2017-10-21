// @flow

import { getComponents } from '../get-components';

const FooComp = () => {};

describe('Default namespace for one component', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: [
          {
            name: 'FooComp',
            filePath: '/path/to/fooComp.js'
          }
        ]
      }
    ];
    const fixtureModules = {
      '/path/to/foo.js': {
        component: FooComp
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has empty namespace', () => {
    expect(components[0].namespace).toBe('');
  });
});

const FooComp1 = () => {};
const FooComp2 = () => {};
const FooComp3 = () => {};

describe('Default namespace for more components', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: [
          {
            name: 'FooComp1',
            filePath: '/path/to1/fooComp1.js'
          },
          {
            name: 'FooComp2',
            filePath: '/path/to2/fooComp2.js'
          },
          {
            name: 'FooComp3',
            filePath: '/path/to2/fooComp3.js'
          }
        ]
      }
    ];
    const fixtureModules = {
      '/path/to/foo.js': [
        {
          component: FooComp1
        },
        {
          component: FooComp2
        },
        {
          component: FooComp3
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has collapsed namespace from file path', () => {
    expect(components[0].namespace).toBe('');
  });

  it('has namespace from file path', () => {
    expect(components[1].namespace).toBe('to2');
  });

  it('has namespace from file path', () => {
    expect(components[2].namespace).toBe('to2');
  });
});

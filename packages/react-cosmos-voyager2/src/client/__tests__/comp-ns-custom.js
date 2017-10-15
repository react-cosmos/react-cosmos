// @flow

import { getComponents } from '../get-components';

const FooComp = () => {};

FooComp.namespace = 'fooNs';

describe('Custom namespace for one component', () => {
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

  it('has custom namespace', () => {
    expect(components[0].namespace).toBe('fooNs');
  });
});

const FooComp1 = () => {};
const FooComp2 = () => {};
const FooComp3 = () => {};

FooComp1.namespace = 'fooNs1';
FooComp2.namespace = 'fooNs2';
FooComp3.namespace = 'fooNs3';

describe('Custom namespace for more components', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/path/to/foo.js',
        components: [
          {
            name: 'FooComp1',
            filePath: '/path/to/fooComp1.js'
          },
          {
            name: 'FooComp2',
            filePath: '/path/to/fooComp2.js'
          },
          {
            name: 'FooComp3',
            filePath: '/path/to/fooComp3.js'
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

  it('has custom namespace', () => {
    expect(components[0].namespace).toBe('fooNs1');
  });

  it('has custom namespace', () => {
    expect(components[1].namespace).toBe('fooNs2');
  });

  it('has custom namespace', () => {
    expect(components[2].namespace).toBe('fooNs3');
  });
});

// @flow

import { getComponents } from '../getComponents';

describe('Single component with static info', () => {
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
        component: () => {}
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has default name', () => {
    expect(components[0].name).toBe('FooComp');
  });

  it('has null path', () => {
    expect(components[0].filePath).toBe('/path/to/fooComp.js');
  });
});

describe('Multi component with static info', () => {
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
    expect(components[0].name).toBe('FooComp1');
  });

  it('has null path', () => {
    expect(components[0].filePath).toBe('/path/to/fooComp1.js');
  });

  it('has default name', () => {
    expect(components[1].name).toBe('FooComp2');
  });

  it('has null path', () => {
    expect(components[1].filePath).toBe('/path/to/fooComp2.js');
  });

  it('has default name', () => {
    expect(components[2].name).toBe('FooComp3');
  });

  it('has null path', () => {
    expect(components[2].filePath).toBe('/path/to/fooComp3.js');
  });
});

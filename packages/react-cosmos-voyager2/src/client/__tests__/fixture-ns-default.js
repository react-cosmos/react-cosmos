// @flow

import { getComponents } from '../get-components';

const Comp1 = () => {};
const Comp2 = () => {};

describe('Default namespace for one fixture', () => {
  let components;

  beforeEach(async () => {
    const fixtureFiles = [
      {
        filePath: '/fixtures/comp1/ns1/foo.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/fixtures/comp1/ns1/foo.js': {
        component: Comp1
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
        filePath: '/fixtures/comp1/ns1/foo.js',
        components: []
      },
      {
        filePath: '/fixtures/comp1/ns2/foo.js',
        components: []
      },
      {
        filePath: '/fixtures/comp1/ns2/bar.js',
        components: []
      },
      {
        filePath: '/fixtures/comp2/foo.js',
        components: []
      }
    ];
    const fixtureModules = {
      '/fixtures/comp1/ns1/foo.js': {
        component: Comp1
      },
      '/fixtures/comp1/ns2/foo.js': {
        component: Comp1
      },
      '/fixtures/comp1/ns2/bar.js': {
        component: Comp1
      },
      '/fixtures/comp2/foo.js': {
        component: Comp2
      }
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('[0][0] has namespace from file path', () => {
    expect(components[0].fixtures[0].namespace).toBe('ns1');
  });

  it('[0][1] has namespace from file path', () => {
    expect(components[0].fixtures[1].namespace).toBe('ns2');
  });

  it('[0][2] has namespace from file path', () => {
    expect(components[0].fixtures[2].namespace).toBe('ns2');
  });

  it('[1][0] has namespace from file path', () => {
    expect(components[1].fixtures[0].namespace).toBe('');
  });
});

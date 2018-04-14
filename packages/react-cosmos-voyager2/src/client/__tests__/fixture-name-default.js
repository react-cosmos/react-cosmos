// @flow

import { getComponents } from '../get-components';

const Comp = () => {};
const Comp2 = () => {};

describe('Default name for single fixture', () => {
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

  it('has name of file', () => {
    expect(components[0].fixtures[0].name).toBe('foo');
  });
});

describe('Default names for multi fixture', () => {
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
          component: Comp
        },
        {
          component: Comp
        },
        {
          component: Comp
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has name of file', () => {
    expect(components[0].fixtures[0].name).toBe('foo');
  });

  it('has name of file', () => {
    expect(components[0].fixtures[1].name).toBe('foo 1');
  });

  it('has name of file', () => {
    expect(components[0].fixtures[2].name).toBe('foo 2');
  });
});

describe('Default names for multi fixture with multi components', () => {
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
          component: Comp
        },
        {
          component: Comp
        },
        {
          component: Comp2
        },
        {
          component: Comp2
        }
      ]
    };
    components = await getComponents({ fixtureFiles, fixtureModules });
  });

  it('has name of file', () => {
    expect(components[0].fixtures[0].name).toBe('foo');
  });

  it('has name of file', () => {
    expect(components[0].fixtures[1].name).toBe('foo 1');
  });

  it('has name of file', () => {
    expect(components[1].fixtures[0].name).toBe('foo');
  });

  it('has name of file', () => {
    expect(components[1].fixtures[1].name).toBe('foo 1');
  });
});

import { FixtureNode } from '../shared/types';
import { createRawFixtureTree } from './createRawFixtureTree';

it('creates tree with single fixture', () => {
  const paths = {
    'Dashboard.fixture.js': null,
  };
  const tree: FixtureNode = {
    dirs: {},
    items: {
      'Dashboard.fixture': {
        fixturePath: 'Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

it('creates nested tree with single fixture', () => {
  const paths = {
    'ui/Dashboard.fixture.js': null,
  };
  const tree: FixtureNode = {
    dirs: {
      ui: {
        dirs: {},
        items: {
          'Dashboard.fixture': {
            fixturePath: 'ui/Dashboard.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

it('creates tree with multi fixture', () => {
  const paths = {
    'Button.fixture.js': ['normal', 'disabled'],
  };
  const tree: FixtureNode = {
    dirs: {},
    items: {
      'Button.fixture': {
        fixturePath: 'Button.fixture.js',
        fixtureNames: ['normal', 'disabled'],
      },
    },
  };
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

it('creates nested tree with multi fixture', () => {
  const paths = {
    'ui/Button.fixture.js': ['normal', 'disabled'],
  };
  const tree: FixtureNode = {
    dirs: {
      ui: {
        dirs: {},
        items: {
          'Button.fixture': {
            fixturePath: 'ui/Button.fixture.js',
            fixtureNames: ['normal', 'disabled'],
          },
        },
      },
    },
    items: {},
  };
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

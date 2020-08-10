import { FixtureNode } from '../shared/types';
import { hideFixtureSuffix } from './hideFixtureSuffix';

it('hides fixture suffix in item name', () => {
  const tree: FixtureNode = {
    dirs: {},
    items: {
      'Dashboard.fixture': {
        fixturePath: 'Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  const cleanTree: FixtureNode = {
    dirs: {},
    items: {
      Dashboard: {
        fixturePath: 'Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(hideFixtureSuffix(tree, 'fixture')).toEqual(cleanTree);
});

it('hides fixture suffix in nested item name', () => {
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
  const cleanTree: FixtureNode = {
    dirs: {
      ui: {
        dirs: {},
        items: {
          Dashboard: {
            fixturePath: 'ui/Dashboard.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  expect(hideFixtureSuffix(tree, 'fixture')).toEqual(cleanTree);
});

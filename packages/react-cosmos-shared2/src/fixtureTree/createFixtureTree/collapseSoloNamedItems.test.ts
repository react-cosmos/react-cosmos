import { FixtureNode } from '../shared/types';
import { collapseSoloNamedItems } from './collapseSoloNamedItems';

it('collapses solo named item', () => {
  const tree: FixtureNode = {
    dirs: {
      Dashboard: {
        dirs: {},
        items: {
          Dashboard: {
            fixturePath: 'Dashboard/Dashboard.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  const collapsedTree: FixtureNode = {
    dirs: {},
    items: {
      Dashboard: {
        fixturePath: 'Dashboard/Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(collapseSoloNamedItems(tree)).toEqual(collapsedTree);
});

it('collapses solo named item (case insensitive)', () => {
  const tree: FixtureNode = {
    dirs: {
      dashboard: {
        dirs: {},
        items: {
          Dashboard: {
            fixturePath: 'dashboard/Dashboard.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  const collapsedTree: FixtureNode = {
    dirs: {},
    items: {
      Dashboard: {
        fixturePath: 'dashboard/Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(collapseSoloNamedItems(tree)).toEqual(collapsedTree);
});

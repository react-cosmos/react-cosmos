import { FixtureNode } from '../shared/types';
import { collapseSoloIndexes } from './collapseSoloIndexes';

it('collapses solo index item', () => {
  const tree: FixtureNode = {
    dirs: {
      Dashboard: {
        dirs: {},
        items: {
          index: {
            fixturePath: 'Dashboard/index.fixture.js',
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
        fixturePath: 'Dashboard/index.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(collapseSoloIndexes(tree)).toEqual(collapsedTree);
});

it('does not collapse index item with sibling item', () => {
  const tree: FixtureNode = {
    dirs: {
      Dashboard: {
        dirs: {},
        items: {
          index: {
            fixturePath: 'Dashboard/index.fixture.js',
            fixtureNames: null,
          },
          Settings: {
            fixturePath: 'Dashboard/Settings.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  const collapsedTree: FixtureNode = {
    dirs: {
      Dashboard: {
        dirs: {},
        items: {
          index: {
            fixturePath: 'Dashboard/index.fixture.js',
            fixtureNames: null,
          },
          Settings: {
            fixturePath: 'Dashboard/Settings.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  expect(collapseSoloIndexes(tree)).toEqual(collapsedTree);
});

it('does not collapse index item with collapsed sibling dir', () => {
  const tree: FixtureNode = {
    dirs: {
      Dashboard: {
        dirs: {
          Settings: {
            dirs: {},
            items: {
              index: {
                fixturePath: 'Dashboard/Settings/index.fixture.js',
                fixtureNames: null,
              },
            },
          },
        },
        items: {
          index: {
            fixturePath: 'Dashboard/index.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  const collapsedTree: FixtureNode = {
    dirs: {
      Dashboard: {
        dirs: {},
        items: {
          index: {
            fixturePath: 'Dashboard/index.fixture.js',
            fixtureNames: null,
          },
          Settings: {
            fixturePath: 'Dashboard/Settings/index.fixture.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  expect(collapseSoloIndexes(tree)).toEqual(collapsedTree);
});

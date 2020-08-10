import { FixtureNode } from '../shared/types';
import { collapseSingleChildDirs } from './collapseSingleChildDirs';

it('hides one single-child root dir', () => {
  const tree: FixtureNode = {
    dirs: {
      src: {
        dirs: {},
        items: {
          Dashboard: {
            fixturePath: 'src/Dashboard.fixture.js',
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
        fixturePath: 'src/Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(collapseSingleChildDirs(tree)).toEqual(collapsedTree);
});

it('hide all single-child root dirs', () => {
  const tree: FixtureNode = {
    dirs: {
      src: {
        dirs: {
          ui: {
            dirs: {
              admin: {
                dirs: {},
                items: {
                  Dashboard: {
                    fixturePath: 'src/ui/admin/Dashboard.fixture.js',
                    fixtureNames: null,
                  },
                },
              },
            },
            items: {},
          },
        },
        items: {},
      },
    },
    items: {},
  };
  const collapsedTree: FixtureNode = {
    dirs: {},
    items: {
      Dashboard: {
        fixturePath: 'src/ui/admin/Dashboard.fixture.js',
        fixtureNames: null,
      },
    },
  };
  expect(collapseSingleChildDirs(tree)).toEqual(collapsedTree);
});

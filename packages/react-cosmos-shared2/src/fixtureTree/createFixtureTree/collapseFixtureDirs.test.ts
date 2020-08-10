import { FixtureNode } from '../shared/types';
import { collapseFixtureDirs } from './collapseFixtureDirs';

it('collapses fixture dirs', () => {
  const tree: FixtureNode = {
    dirs: {
      ui: {
        dirs: {
          __fixtures__: {
            dirs: {
              shared: {
                dirs: {},
                items: {
                  Button: {
                    fixturePath: 'ui/__fixtures__/shared/Button.js',
                    fixtureNames: ['normal', 'disabled'],
                  },
                },
              },
            },
            items: {
              Dashboard: {
                fixturePath: 'ui/__fixtures__/Dashboard.js',
                fixtureNames: null,
              },
            },
          },
        },
        items: {},
      },
    },
    items: {},
  };
  const collapsedTree: FixtureNode = {
    dirs: {
      ui: {
        dirs: {
          shared: {
            dirs: {},
            items: {
              Button: {
                fixturePath: 'ui/__fixtures__/shared/Button.js',
                fixtureNames: ['normal', 'disabled'],
              },
            },
          },
        },
        items: {
          Dashboard: {
            fixturePath: 'ui/__fixtures__/Dashboard.js',
            fixtureNames: null,
          },
        },
      },
    },
    items: {},
  };
  expect(collapseFixtureDirs(tree, '__fixtures__')).toEqual(collapsedTree);
});

import { collapseSoloIndexes } from './collapseSoloIndexes';

it('collapses solo index item', () => {
  const tree = {
    items: {},
    dirs: {
      SuccessMessage: {
        items: {
          index: {
            path: 'SuccessMessage/index.fixture.js',
            name: null
          }
        },
        dirs: {}
      }
    }
  };
  const collapsedTree = {
    items: {
      SuccessMessage: {
        path: 'SuccessMessage/index.fixture.js',
        name: null
      }
    },
    dirs: {}
  };
  expect(collapseSoloIndexes(tree)).toEqual(collapsedTree);
});

it('collapses solo index dir', () => {
  const tree = {
    items: {},
    dirs: {
      WelcomeMessage: {
        items: {},
        dirs: {
          index: {
            items: {
              Susan: {
                path: 'WelcomeMessage/index.fixture.js',
                name: 'Susan'
              },
              Sarah: {
                path: 'WelcomeMessage/index.fixture.js',
                name: 'Sarah'
              }
            },
            dirs: {}
          }
        }
      }
    }
  };
  const collapsedTree = {
    items: {},
    dirs: {
      WelcomeMessage: {
        items: {
          Susan: {
            path: 'WelcomeMessage/index.fixture.js',
            name: 'Susan'
          },
          Sarah: {
            path: 'WelcomeMessage/index.fixture.js',
            name: 'Sarah'
          }
        },
        dirs: {}
      }
    }
  };
  expect(collapseSoloIndexes(tree)).toEqual(collapsedTree);
});

import { collapseDirs } from './collapseDirs';

it('collapses dirs', () => {
  const tree = {
    items: {},
    dirs: {
      Counter: {
        items: {},
        dirs: {
          __fixtures__: {
            items: {
              largeNumber: {
                path: 'Counter/__fixtures__/largeNumber.js',
                name: null
              }
            },
            dirs: {
              smallNumbers: {
                items: {
                  five: {
                    path: 'Counter/__fixtures__/smallNumbers.js',
                    name: 'five'
                  },
                  fiftyFive: {
                    path: 'Counter/__fixtures__/smallNumbers.js',
                    name: 'fiftyFive'
                  }
                },
                dirs: {}
              }
            }
          }
        }
      }
    }
  };
  const collapsedTree = {
    items: {},
    dirs: {
      Counter: {
        items: {
          largeNumber: {
            path: 'Counter/__fixtures__/largeNumber.js',
            name: null
          }
        },
        dirs: {
          smallNumbers: {
            items: {
              five: {
                path: 'Counter/__fixtures__/smallNumbers.js',
                name: 'five'
              },
              fiftyFive: {
                path: 'Counter/__fixtures__/smallNumbers.js',
                name: 'fiftyFive'
              }
            },
            dirs: {}
          }
        }
      }
    }
  };
  expect(collapseDirs(tree, '__fixtures__')).toEqual(collapsedTree);
});

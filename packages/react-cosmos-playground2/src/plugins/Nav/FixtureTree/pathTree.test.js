// @flow

import { getPathTree, collapsePathTreeDirs } from './pathTree';

const paths = [
  '__jsxfixtures__/welcomeMessage.js',
  'components/Counter/__jsxfixtures__/defaultState.js',
  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
];

const tree = {
  fixtures: [],
  dirs: {
    __jsxfixtures__: {
      dirs: {},
      fixtures: ['__jsxfixtures__/welcomeMessage.js']
    },
    components: {
      dirs: {
        Counter: {
          dirs: {
            __jsxfixtures__: {
              dirs: {
                mockedState: {
                  dirs: {},
                  fixtures: [
                    'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                    'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
                  ]
                }
              },
              fixtures: ['components/Counter/__jsxfixtures__/defaultState.js']
            }
          }
        }
      }
    }
  }
};

const collapsedTree = {
  fixtures: ['__jsxfixtures__/welcomeMessage.js'],
  dirs: {
    components: {
      dirs: {
        Counter: {
          dirs: {
            mockedState: {
              dirs: {},
              fixtures: [
                'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
              ]
            }
          },
          fixtures: ['components/Counter/__jsxfixtures__/defaultState.js']
        }
      }
    }
  }
};

it('creates path tree', () => {
  expect(getPathTree(paths)).toEqual(tree);
});

it('collapses __jsxfixtures__ dirs', () => {
  expect(collapsePathTreeDirs(tree, '__jsxfixtures__')).toEqual(collapsedTree);
});

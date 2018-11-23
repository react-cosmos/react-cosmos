// @flow

import { getPathTree, collapsePathTreeDirs } from './pathTree';

const paths = [
  '__jsxfixtures__/welcomeMessage.js',
  'components/Counter/__jsxfixtures__/defaultState.js',
  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
];

const tree = {
  values: [],
  children: {
    __jsxfixtures__: {
      children: {},
      values: ['__jsxfixtures__/welcomeMessage.js']
    },
    components: {
      children: {
        Counter: {
          children: {
            __jsxfixtures__: {
              children: {
                mockedState: {
                  children: {},
                  values: [
                    'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                    'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
                  ]
                }
              },
              values: ['components/Counter/__jsxfixtures__/defaultState.js']
            }
          }
        }
      }
    }
  }
};

const collapsedTree = {
  values: ['__jsxfixtures__/welcomeMessage.js'],
  children: {
    components: {
      children: {
        Counter: {
          children: {
            mockedState: {
              children: {},
              values: [
                'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
              ]
            }
          },
          values: ['components/Counter/__jsxfixtures__/defaultState.js']
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

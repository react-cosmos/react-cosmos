// @flow

import {
  getPathTree,
  collapsePathTreeDirs,
  hideFixtureSuffix
} from './pathTree';

const paths = [
  '__jsxfixtures__/welcomeMessage.js',
  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js',
  'components/Counter/defaultState.jsxfixture.js'
];

const tree = {
  dirs: {
    __jsxfixtures__: {
      dirs: {},
      fixtures: {
        welcomeMessage: '__jsxfixtures__/welcomeMessage.js'
      }
    },
    components: {
      dirs: {
        Counter: {
          dirs: {
            __jsxfixtures__: {
              dirs: {
                mockedState: {
                  dirs: {},
                  fixtures: {
                    largeNumber:
                      'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                    smallNumber:
                      'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
                  }
                }
              }
            }
          },
          fixtures: {
            'defaultState.jsxfixture':
              'components/Counter/defaultState.jsxfixture.js'
          }
        }
      }
    }
  }
};

const collapsedTree = {
  fixtures: {
    welcomeMessage: '__jsxfixtures__/welcomeMessage.js'
  },
  dirs: {
    components: {
      dirs: {
        Counter: {
          dirs: {
            mockedState: {
              dirs: {},
              fixtures: {
                largeNumber:
                  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                smallNumber:
                  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
              }
            }
          },
          fixtures: {
            'defaultState.jsxfixture':
              'components/Counter/defaultState.jsxfixture.js'
          }
        }
      }
    }
  }
};

const suffixHiddenTree = {
  fixtures: {
    welcomeMessage: '__jsxfixtures__/welcomeMessage.js'
  },
  dirs: {
    components: {
      dirs: {
        Counter: {
          dirs: {
            mockedState: {
              dirs: {},
              fixtures: {
                largeNumber:
                  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                smallNumber:
                  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
              }
            }
          },
          fixtures: {
            defaultState: 'components/Counter/defaultState.jsxfixture.js'
          }
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

it('hides .jsxfixture suffix', () => {
  expect(hideFixtureSuffix(collapsedTree, 'jsxfixture')).toEqual(
    suffixHiddenTree
  );
});

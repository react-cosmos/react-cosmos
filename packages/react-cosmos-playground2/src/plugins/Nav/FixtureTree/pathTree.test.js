// @flow

import {
  getPathTree,
  collapsePathTreeDirs,
  hideFixtureSuffix,
  collapseSoloIndexes
} from './pathTree';

const paths = [
  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js',
  'components/WelcomeMessage/index.jsxfixture.js',
  'components/Counter/defaultState.jsxfixture.js'
];

const tree = {
  dirs: {
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
        },
        WelcomeMessage: {
          dirs: {},
          fixtures: {
            'index.jsxfixture': 'components/WelcomeMessage/index.jsxfixture.js'
          }
        }
      }
    }
  }
};

const collapsedTree = {
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
        },
        WelcomeMessage: {
          dirs: {},
          fixtures: {
            'index.jsxfixture': 'components/WelcomeMessage/index.jsxfixture.js'
          }
        }
      }
    }
  }
};

const suffixHiddenTree = {
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
        },
        WelcomeMessage: {
          dirs: {},
          fixtures: {
            index: 'components/WelcomeMessage/index.jsxfixture.js'
          }
        }
      }
    }
  }
};

const collapsedIndexTree = {
  dirs: {
    components: {
      fixtures: {
        WelcomeMessage: 'components/WelcomeMessage/index.jsxfixture.js'
      },
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

it('collapses solo index fixture', () => {
  expect(collapseSoloIndexes(suffixHiddenTree)).toEqual(collapsedIndexTree);
});

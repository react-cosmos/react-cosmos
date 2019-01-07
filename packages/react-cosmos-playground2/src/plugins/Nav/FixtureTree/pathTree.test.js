// @flow

import {
  getPathTree,
  collapsePathTreeDirs,
  hideFixtureSuffix,
  collapseSoloIndexes
} from './pathTree';

const paths = [
  'helloWorld.jsxfixture.js',
  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js',
  'components/Counter/defaultState.jsxfixture.js',
  'components/WelcomeMessage/index.jsxfixture.js'
];

const tree = {
  fixtures: {
    'helloWorld.jsxfixture': 'helloWorld.jsxfixture.js'
  },
  dirs: {
    components: {
      fixtures: {},
      dirs: {
        Counter: {
          fixtures: {
            'defaultState.jsxfixture':
              'components/Counter/defaultState.jsxfixture.js'
          },
          dirs: {
            __jsxfixtures__: {
              fixtures: {},
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
          }
        },
        WelcomeMessage: {
          fixtures: {
            'index.jsxfixture': 'components/WelcomeMessage/index.jsxfixture.js'
          },
          dirs: {}
        }
      }
    }
  }
};

const collapsedTree = {
  fixtures: {
    'helloWorld.jsxfixture': 'helloWorld.jsxfixture.js'
  },
  dirs: {
    components: {
      fixtures: {},
      dirs: {
        Counter: {
          dirs: {
            mockedState: {
              fixtures: {
                largeNumber:
                  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                smallNumber:
                  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
              },
              dirs: {}
            }
          },
          fixtures: {
            'defaultState.jsxfixture':
              'components/Counter/defaultState.jsxfixture.js'
          }
        },
        WelcomeMessage: {
          fixtures: {
            'index.jsxfixture': 'components/WelcomeMessage/index.jsxfixture.js'
          },
          dirs: {}
        }
      }
    }
  }
};

const suffixHiddenTree = {
  fixtures: {
    helloWorld: 'helloWorld.jsxfixture.js'
  },
  dirs: {
    components: {
      fixtures: {},
      dirs: {
        Counter: {
          fixtures: {
            defaultState: 'components/Counter/defaultState.jsxfixture.js'
          },
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
        },
        WelcomeMessage: {
          fixtures: {
            index: 'components/WelcomeMessage/index.jsxfixture.js'
          },
          dirs: {}
        }
      }
    }
  }
};

const collapsedIndexTree = {
  fixtures: {
    helloWorld: 'helloWorld.jsxfixture.js'
  },
  dirs: {
    components: {
      fixtures: {
        WelcomeMessage: 'components/WelcomeMessage/index.jsxfixture.js'
      },
      dirs: {
        Counter: {
          fixtures: {
            defaultState: 'components/Counter/defaultState.jsxfixture.js'
          },
          dirs: {
            mockedState: {
              fixtures: {
                largeNumber:
                  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                smallNumber:
                  'components/Counter/__jsxfixtures__/mockedState/smallNumber.js'
              },
              dirs: {}
            }
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

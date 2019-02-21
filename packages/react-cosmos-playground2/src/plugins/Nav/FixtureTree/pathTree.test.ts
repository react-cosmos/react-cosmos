import { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import {
  getPathTree,
  collapsePathTreeDirs,
  hideFixtureSuffix,
  collapseSoloIndexes
} from './pathTree';

const fixtures: FixtureNamesByPath = {
  'helloWorld.jsxfixture.js': null,
  'components/Counter/__jsxfixtures__/mockedState/largeNumber.js': null,
  'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js': [
    'five',
    'fiftyFive'
  ],
  'components/Counter/defaultState.jsxfixture.js': null,
  'components/SuccessMessage/index.jsxfixture.js': null,
  'components/WelcomeMessage/index.jsxfixture.js': ['Susan', 'Sarah'],
  'components/WelcomeMessage/Sandra.jsxfixture.js': null
};

const tree = {
  items: {
    'helloWorld.jsxfixture': {
      path: 'helloWorld.jsxfixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {},
      dirs: {
        Counter: {
          items: {
            'defaultState.jsxfixture': {
              path: 'components/Counter/defaultState.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            __jsxfixtures__: {
              items: {},
              dirs: {
                mockedState: {
                  items: {
                    largeNumber: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                      name: null
                    }
                  },
                  dirs: {
                    smallNumbers: {
                      items: {
                        five: {
                          path:
                            'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                          name: 'five'
                        },
                        fiftyFive: {
                          path:
                            'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
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
        },
        SuccessMessage: {
          items: {
            'index.jsxfixture': {
              path: 'components/SuccessMessage/index.jsxfixture.js',
              name: null
            }
          },
          dirs: {}
        },
        WelcomeMessage: {
          items: {
            'Sandra.jsxfixture': {
              path: 'components/WelcomeMessage/Sandra.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            'index.jsxfixture': {
              items: {
                Susan: {
                  path: 'components/WelcomeMessage/index.jsxfixture.js',
                  name: 'Susan'
                },
                Sarah: {
                  path: 'components/WelcomeMessage/index.jsxfixture.js',
                  name: 'Sarah'
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
  items: {
    'helloWorld.jsxfixture': {
      path: 'helloWorld.jsxfixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {},
      dirs: {
        Counter: {
          items: {
            'defaultState.jsxfixture': {
              path: 'components/Counter/defaultState.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            mockedState: {
              items: {
                largeNumber: {
                  path:
                    'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                  name: null
                }
              },
              dirs: {
                smallNumbers: {
                  items: {
                    five: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                      name: 'five'
                    },
                    fiftyFive: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                      name: 'fiftyFive'
                    }
                  },
                  dirs: {}
                }
              }
            }
          }
        },
        SuccessMessage: {
          items: {
            'index.jsxfixture': {
              path: 'components/SuccessMessage/index.jsxfixture.js',
              name: null
            }
          },
          dirs: {}
        },
        WelcomeMessage: {
          items: {
            'Sandra.jsxfixture': {
              path: 'components/WelcomeMessage/Sandra.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            'index.jsxfixture': {
              items: {
                Susan: {
                  path: 'components/WelcomeMessage/index.jsxfixture.js',
                  name: 'Susan'
                },
                Sarah: {
                  path: 'components/WelcomeMessage/index.jsxfixture.js',
                  name: 'Sarah'
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

const suffixHiddenTree = {
  items: {
    helloWorld: {
      path: 'helloWorld.jsxfixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {},
      dirs: {
        Counter: {
          items: {
            defaultState: {
              path: 'components/Counter/defaultState.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            mockedState: {
              items: {
                largeNumber: {
                  path:
                    'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                  name: null
                }
              },
              dirs: {
                smallNumbers: {
                  items: {
                    five: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                      name: 'five'
                    },
                    fiftyFive: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                      name: 'fiftyFive'
                    }
                  },
                  dirs: {}
                }
              }
            }
          }
        },
        SuccessMessage: {
          items: {
            index: {
              path: 'components/SuccessMessage/index.jsxfixture.js',
              name: null
            }
          },
          dirs: {}
        },
        WelcomeMessage: {
          items: {
            Sandra: {
              path: 'components/WelcomeMessage/Sandra.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            index: {
              items: {
                Susan: {
                  path: 'components/WelcomeMessage/index.jsxfixture.js',
                  name: 'Susan'
                },
                Sarah: {
                  path: 'components/WelcomeMessage/index.jsxfixture.js',
                  name: 'Sarah'
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

const collapsedIndexTree = {
  items: {
    helloWorld: {
      path: 'helloWorld.jsxfixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {
        SuccessMessage: {
          path: 'components/SuccessMessage/index.jsxfixture.js',
          name: null
        }
      },
      dirs: {
        Counter: {
          items: {
            defaultState: {
              path: 'components/Counter/defaultState.jsxfixture.js',
              name: null
            }
          },
          dirs: {
            mockedState: {
              items: {
                largeNumber: {
                  path:
                    'components/Counter/__jsxfixtures__/mockedState/largeNumber.js',
                  name: null
                }
              },
              dirs: {
                smallNumbers: {
                  items: {
                    five: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                      name: 'five'
                    },
                    fiftyFive: {
                      path:
                        'components/Counter/__jsxfixtures__/mockedState/smallNumbers.js',
                      name: 'fiftyFive'
                    }
                  },
                  dirs: {}
                }
              }
            }
          }
        },
        WelcomeMessage: {
          items: {
            Sandra: {
              path: 'components/WelcomeMessage/Sandra.jsxfixture.js',
              name: null
            },
            Susan: {
              path: 'components/WelcomeMessage/index.jsxfixture.js',
              name: 'Susan'
            },
            Sarah: {
              path: 'components/WelcomeMessage/index.jsxfixture.js',
              name: 'Sarah'
            }
          },
          dirs: {}
        }
      }
    }
  }
};

it('creates path tree', () => {
  expect(getPathTree(fixtures)).toEqual(tree);
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

import { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import {
  getPathTree,
  collapsePathTreeDirs,
  hideFixtureSuffix,
  collapseSoloIndexes
} from './pathTree';

const fixtures: FixtureNamesByPath = {
  'helloWorld.fixture.js': null,
  'components/Counter/__fixtures__/mockedState/largeNumber.js': null,
  'components/Counter/__fixtures__/mockedState/smallNumbers.js': [
    'five',
    'fiftyFive'
  ],
  'components/Counter/defaultState.fixture.js': null,
  'components/SuccessMessage/index.fixture.js': null,
  'components/WelcomeMessage/index.fixture.js': ['Susan', 'Sarah']
};

const tree = {
  items: {
    'helloWorld.fixture': {
      path: 'helloWorld.fixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {},
      dirs: {
        Counter: {
          items: {
            'defaultState.fixture': {
              path: 'components/Counter/defaultState.fixture.js',
              name: null
            }
          },
          dirs: {
            __fixtures__: {
              items: {},
              dirs: {
                mockedState: {
                  items: {
                    largeNumber: {
                      path:
                        'components/Counter/__fixtures__/mockedState/largeNumber.js',
                      name: null
                    }
                  },
                  dirs: {
                    smallNumbers: {
                      items: {
                        five: {
                          path:
                            'components/Counter/__fixtures__/mockedState/smallNumbers.js',
                          name: 'five'
                        },
                        fiftyFive: {
                          path:
                            'components/Counter/__fixtures__/mockedState/smallNumbers.js',
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
            'index.fixture': {
              path: 'components/SuccessMessage/index.fixture.js',
              name: null
            }
          },
          dirs: {}
        },
        WelcomeMessage: {
          items: {},
          dirs: {
            'index.fixture': {
              items: {
                Susan: {
                  path: 'components/WelcomeMessage/index.fixture.js',
                  name: 'Susan'
                },
                Sarah: {
                  path: 'components/WelcomeMessage/index.fixture.js',
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
    'helloWorld.fixture': {
      path: 'helloWorld.fixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {},
      dirs: {
        Counter: {
          items: {
            'defaultState.fixture': {
              path: 'components/Counter/defaultState.fixture.js',
              name: null
            }
          },
          dirs: {
            mockedState: {
              items: {
                largeNumber: {
                  path:
                    'components/Counter/__fixtures__/mockedState/largeNumber.js',
                  name: null
                }
              },
              dirs: {
                smallNumbers: {
                  items: {
                    five: {
                      path:
                        'components/Counter/__fixtures__/mockedState/smallNumbers.js',
                      name: 'five'
                    },
                    fiftyFive: {
                      path:
                        'components/Counter/__fixtures__/mockedState/smallNumbers.js',
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
            'index.fixture': {
              path: 'components/SuccessMessage/index.fixture.js',
              name: null
            }
          },
          dirs: {}
        },
        WelcomeMessage: {
          items: {},
          dirs: {
            'index.fixture': {
              items: {
                Susan: {
                  path: 'components/WelcomeMessage/index.fixture.js',
                  name: 'Susan'
                },
                Sarah: {
                  path: 'components/WelcomeMessage/index.fixture.js',
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
      path: 'helloWorld.fixture.js',
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
              path: 'components/Counter/defaultState.fixture.js',
              name: null
            }
          },
          dirs: {
            mockedState: {
              items: {
                largeNumber: {
                  path:
                    'components/Counter/__fixtures__/mockedState/largeNumber.js',
                  name: null
                }
              },
              dirs: {
                smallNumbers: {
                  items: {
                    five: {
                      path:
                        'components/Counter/__fixtures__/mockedState/smallNumbers.js',
                      name: 'five'
                    },
                    fiftyFive: {
                      path:
                        'components/Counter/__fixtures__/mockedState/smallNumbers.js',
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
              path: 'components/SuccessMessage/index.fixture.js',
              name: null
            }
          },
          dirs: {}
        },
        WelcomeMessage: {
          items: {},
          dirs: {
            index: {
              items: {
                Susan: {
                  path: 'components/WelcomeMessage/index.fixture.js',
                  name: 'Susan'
                },
                Sarah: {
                  path: 'components/WelcomeMessage/index.fixture.js',
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
      path: 'helloWorld.fixture.js',
      name: null
    }
  },
  dirs: {
    components: {
      items: {
        SuccessMessage: {
          path: 'components/SuccessMessage/index.fixture.js',
          name: null
        }
      },
      dirs: {
        Counter: {
          items: {
            defaultState: {
              path: 'components/Counter/defaultState.fixture.js',
              name: null
            }
          },
          dirs: {
            mockedState: {
              items: {
                largeNumber: {
                  path:
                    'components/Counter/__fixtures__/mockedState/largeNumber.js',
                  name: null
                }
              },
              dirs: {
                smallNumbers: {
                  items: {
                    five: {
                      path:
                        'components/Counter/__fixtures__/mockedState/smallNumbers.js',
                      name: 'five'
                    },
                    fiftyFive: {
                      path:
                        'components/Counter/__fixtures__/mockedState/smallNumbers.js',
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
            Susan: {
              path: 'components/WelcomeMessage/index.fixture.js',
              name: 'Susan'
            },
            Sarah: {
              path: 'components/WelcomeMessage/index.fixture.js',
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

it('collapses __fixtures__ dirs', () => {
  expect(collapsePathTreeDirs(tree, '__fixtures__')).toEqual(collapsedTree);
});

it('hides .fixture suffix', () => {
  expect(hideFixtureSuffix(collapsedTree, 'fixture')).toEqual(suffixHiddenTree);
});

it('collapses solo index fixture', () => {
  expect(collapseSoloIndexes(suffixHiddenTree)).toEqual(collapsedIndexTree);
});

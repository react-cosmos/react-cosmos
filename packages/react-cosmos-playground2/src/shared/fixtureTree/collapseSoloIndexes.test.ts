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

it('collapses solo named index item', () => {
  const tree = {
    items: {},
    dirs: {
      SuccessMessage: {
        items: {
          SuccessMessage: {
            path: 'SuccessMessage/SuccessMessage.fixture.js',
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
        path: 'SuccessMessage/SuccessMessage.fixture.js',
        name: null
      }
    },
    dirs: {}
  };
  expect(collapseSoloIndexes(tree)).toEqual(collapsedTree);
});

it('does not collapse solo index item with sub dirs', () => {
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
        dirs: {
          SpecialWelcome: {
            items: {
              index: {
                path: 'SuccessMessage/AwesomeMessage/index.fixture.js',
                name: null
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
      SuccessMessage: {
        items: {
          index: {
            path: 'SuccessMessage/index.fixture.js',
            name: null
          },
          SpecialWelcome: {
            path: 'SuccessMessage/AwesomeMessage/index.fixture.js',
            name: null
          }
        },
        dirs: {}
      }
    }
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

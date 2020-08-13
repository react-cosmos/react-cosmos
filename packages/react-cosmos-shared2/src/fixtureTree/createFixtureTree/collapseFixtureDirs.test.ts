import { FixtureTreeNode } from '../shared/types';
import { collapseFixtureDirs } from './collapseFixtureDirs';

it('collapses fixture dir', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          __fixtures__: {
            data: { type: 'fileDir' },
            children: {
              shared: {
                data: { type: 'fileDir' },
                children: {
                  Button: {
                    data: { type: 'multiFixture' },
                    children: {
                      normal: {
                        data: {
                          type: 'fixture',
                          fixtureId: {
                            path: 'ui/__fixtures__/shared/Button.js',
                            name: 'normal',
                          },
                        },
                      },
                      disabled: {
                        data: {
                          type: 'fixture',
                          fixtureId: {
                            path: 'ui/__fixtures__/shared/Button.js',
                            name: 'disabled',
                          },
                        },
                      },
                    },
                  },
                },
              },
              Dashboard: {
                data: {
                  type: 'fixture',
                  fixtureId: {
                    path: 'ui/__fixtures__/Dashboard.js',
                    name: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  const collapsedTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          shared: {
            data: { type: 'fileDir' },
            children: {
              Button: {
                data: { type: 'multiFixture' },
                children: {
                  normal: {
                    data: {
                      type: 'fixture',
                      fixtureId: {
                        path: 'ui/__fixtures__/shared/Button.js',
                        name: 'normal',
                      },
                    },
                  },
                  disabled: {
                    data: {
                      type: 'fixture',
                      fixtureId: {
                        path: 'ui/__fixtures__/shared/Button.js',
                        name: 'disabled',
                      },
                    },
                  },
                },
              },
            },
          },
          Dashboard: {
            data: {
              type: 'fixture',
              fixtureId: {
                path: 'ui/__fixtures__/Dashboard.js',
                name: null,
              },
            },
          },
        },
      },
    },
  };
  expect(collapseFixtureDirs(tree, '__fixtures__')).toEqual(collapsedTree);
});

it('collapses fixture dir with sibling', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          __fixtures__: {
            data: { type: 'fileDir' },
            children: {
              Dashboard: {
                data: {
                  type: 'fixture',
                  fixtureId: {
                    path: 'ui/__fixtures__/Dashboard.js',
                    name: null,
                  },
                },
              },
            },
          },
          shared: {
            data: { type: 'fileDir' },
            children: {
              Button: {
                data: {
                  type: 'fixture',
                  fixtureId: {
                    path: 'ui/shared/Button.fixture.js',
                    name: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  const collapsedTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          shared: {
            data: { type: 'fileDir' },
            children: {
              Button: {
                data: {
                  type: 'fixture',
                  fixtureId: {
                    path: 'ui/shared/Button.fixture.js',
                    name: null,
                  },
                },
              },
            },
          },
          Dashboard: {
            data: {
              type: 'fixture',
              fixtureId: {
                path: 'ui/__fixtures__/Dashboard.js',
                name: null,
              },
            },
          },
        },
      },
    },
  };
  expect(collapseFixtureDirs(tree, '__fixtures__')).toEqual(collapsedTree);
});

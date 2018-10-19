import fixturesToTreeData from '../data-mapper';

test('transforms fixture data structure to tree data structure', () => {
  const input = {
    'dirA/Component1': ['fixtureA', 'fixtureB'],
    'dirB/Component2': ['fixtureA', 'fixtureB'],
    'dirB/Component3': ['fixtureA', 'fixtureB'],
    'dirB/subdirA/Component4': ['fixtureA', 'fixtureB']
  };

  const expected = [
    {
      name: 'dirA',
      type: 'directory',
      expanded: true,
      path: 'dirA',
      displayData: null,
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: false,
          path: 'dirA/Component1',
          displayData: {
            componentName: 'Component1',
            hocs: [],
            search: 'Component1'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureB'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'dirB',
      type: 'directory',
      expanded: true,
      path: 'dirB',
      displayData: null,
      children: [
        // Dirs are placed before components
        {
          name: 'subdirA',
          type: 'directory',
          expanded: true,
          path: 'dirB/subdirA',
          displayData: null,
          children: [
            {
              name: 'Component4',
              path: 'dirB/subdirA/Component4',
              type: 'component',
              expanded: false,
              displayData: {
                componentName: 'Component4',
                hocs: [],
                search: 'Component4'
              },
              children: [
                {
                  name: 'fixtureA',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/subdirA/Component4',
                    fixture: 'fixtureA'
                  }
                },
                {
                  name: 'fixtureB',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/subdirA/Component4',
                    fixture: 'fixtureB'
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'Component2',
          type: 'component',
          expanded: false,
          path: 'dirB/Component2',
          displayData: {
            componentName: 'Component2',
            hocs: [],
            search: 'Component2'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureB'
              }
            }
          ]
        },
        {
          name: 'Component3',
          type: 'component',
          expanded: false,
          path: 'dirB/Component3',
          displayData: {
            componentName: 'Component3',
            hocs: [],
            search: 'Component3'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component3',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component3',
                fixture: 'fixtureB'
              }
            }
          ]
        }
      ]
    }
  ];

  expect(fixturesToTreeData(input, {})).toEqual(expected);
});

test('allows specifying a savedExpansionState object', () => {
  const input = {
    'dirA/Component1': ['fixtureA', 'fixtureB'],
    'dirB/Component2': ['fixtureA', 'fixtureB'],
    'dirB/Component3': ['fixtureA', 'fixtureB'],
    'dirB/subdirA/Component4': ['fixtureA', 'fixtureB']
  };

  const savedExpansionState = {
    'dirB/subdirA/Component4': false
  };

  const expected = [
    {
      name: 'dirA',
      type: 'directory',
      expanded: true,
      path: 'dirA',
      displayData: null,
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: false,
          path: 'dirA/Component1',
          displayData: {
            componentName: 'Component1',
            hocs: [],
            search: 'Component1'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureB'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'dirB',
      type: 'directory',
      expanded: true,
      path: 'dirB',
      displayData: null,
      children: [
        // Dirs are placed before components
        {
          name: 'subdirA',
          type: 'directory',
          expanded: true,
          path: 'dirB/subdirA',
          displayData: null,
          children: [
            {
              name: 'Component4',
              path: 'dirB/subdirA/Component4',
              type: 'component',
              expanded: false,
              displayData: {
                componentName: 'Component4',
                hocs: [],
                search: 'Component4'
              },
              children: [
                {
                  name: 'fixtureA',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/subdirA/Component4',
                    fixture: 'fixtureA'
                  }
                },
                {
                  name: 'fixtureB',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/subdirA/Component4',
                    fixture: 'fixtureB'
                  }
                }
              ]
            }
          ]
        },
        {
          name: 'Component2',
          type: 'component',
          expanded: false,
          path: 'dirB/Component2',
          displayData: {
            componentName: 'Component2',
            hocs: [],
            search: 'Component2'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureB'
              }
            }
          ]
        },
        {
          name: 'Component3',
          type: 'component',
          expanded: false,
          path: 'dirB/Component3',
          displayData: {
            componentName: 'Component3',
            hocs: [],
            search: 'Component3'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component3',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component3',
                fixture: 'fixtureB'
              }
            }
          ]
        }
      ]
    }
  ];

  expect(fixturesToTreeData(input, savedExpansionState)).toEqual(expected);
});

test('deals with components with namespaced fixtures', () => {
  const input = {
    'dirA/Component1': ['fixtureA', 'fixtureB'],
    'dirB/Component2': [
      'Some folder/fixtureA',
      // Note that only one level of fixture namespace is currently supported
      // This is a regression case for
      //  https://github.com/react-cosmos/react-cosmos/issues/670
      'Some folder/nested/fixtureB',
      'Another folder/fixtureC',
      'fixtureD'
    ]
  };

  const savedExpansionState = {
    'dirB/Component2/Another folder': false
  };

  const expected = [
    {
      name: 'dirA',
      type: 'directory',
      expanded: true,
      path: 'dirA',
      displayData: null,
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: false,
          path: 'dirA/Component1',
          displayData: {
            componentName: 'Component1',
            hocs: [],
            search: 'Component1'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              type: 'fixture',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureB'
              }
            }
          ]
        }
      ]
    },
    {
      name: 'dirB',
      type: 'directory',
      expanded: true,
      path: 'dirB',
      displayData: null,
      children: [
        {
          name: 'Component2',
          type: 'component',
          expanded: false,
          path: 'dirB/Component2',
          displayData: {
            componentName: 'Component2',
            hocs: [],
            search: 'Component2'
          },
          children: [
            {
              name: 'Some folder',
              type: 'fixtureDirectory',
              expanded: false,
              path: 'dirB/Component2/Some folder',
              children: [
                {
                  name: 'fixtureA',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/Component2',
                    fixture: 'Some folder/fixtureA'
                  }
                }
              ]
            },
            {
              name: 'Some folder/nested',
              type: 'fixtureDirectory',
              expanded: false,
              path: 'dirB/Component2/Some folder/nested',
              children: [
                {
                  name: 'fixtureB',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/Component2',
                    fixture: 'Some folder/nested/fixtureB'
                  }
                }
              ]
            },
            {
              name: 'Another folder',
              type: 'fixtureDirectory',
              expanded: false,
              path: 'dirB/Component2/Another folder',
              children: [
                {
                  name: 'fixtureC',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/Component2',
                    fixture: 'Another folder/fixtureC'
                  }
                }
              ]
            },
            {
              name: 'fixtureD',
              type: 'fixture',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureD'
              }
            }
          ]
        }
      ]
    }
  ];

  expect(fixturesToTreeData(input, savedExpansionState)).toEqual(expected);
});

test('deals with extracting hoc names', () => {
  const input = {
    'dirA/withRouter(Connect(Component1))': ['fixtureA']
  };

  const savedExpansionState = {};

  const expected = [
    {
      name: 'dirA',
      type: 'directory',
      expanded: true,
      path: 'dirA',
      displayData: null,
      children: [
        {
          name: 'withRouter(Connect(Component1))',
          type: 'component',
          expanded: false,
          path: 'dirA/withRouter(Connect(Component1))',
          displayData: {
            componentName: 'Component1',
            hocs: ['withRouter', 'Connect'],
            search: 'Component1 withRouter, Connect'
          },
          children: [
            {
              name: 'fixtureA',
              type: 'fixture',
              urlParams: {
                component: 'dirA/withRouter(Connect(Component1))',
                fixture: 'fixtureA'
              }
            }
          ]
        }
      ]
    }
  ];

  expect(fixturesToTreeData(input, savedExpansionState)).toEqual(expected);
});

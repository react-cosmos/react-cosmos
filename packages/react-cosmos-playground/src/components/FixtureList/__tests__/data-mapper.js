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
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: true,
          path: 'dirA/Component1',
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
      children: [
        {
          name: 'Component2',
          type: 'component',
          expanded: true,
          path: 'dirB/Component2',
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
          expanded: true,
          path: 'dirB/Component3',
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
        },
        {
          name: 'subdirA',
          type: 'directory',
          expanded: true,
          path: 'dirB/subdirA',
          children: [
            {
              name: 'Component4',
              path: 'dirB/subdirA/Component4',
              type: 'component',
              expanded: true,
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
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: true,
          path: 'dirA/Component1',
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
      children: [
        {
          name: 'Component2',
          type: 'component',
          expanded: true,
          path: 'dirB/Component2',
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
          expanded: true,
          path: 'dirB/Component3',
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
        },
        {
          name: 'subdirA',
          type: 'directory',
          expanded: true,
          path: 'dirB/subdirA',
          children: [
            {
              name: 'Component4',
              path: 'dirB/subdirA/Component4',
              type: 'component',
              expanded: false,
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
      'Some folder/fixtureB',
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
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: true,
          path: 'dirA/Component1',
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
      children: [
        {
          name: 'Component2',
          type: 'component',
          expanded: true,
          path: 'dirB/Component2',
          children: [
            {
              name: 'Some folder',
              type: 'fixtureDirectory',
              expanded: true,
              path: 'dirB/Component2/Some folder',
              children: [
                {
                  name: 'fixtureA',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/Component2',
                    fixture: 'Some folder/fixtureA'
                  }
                },
                {
                  name: 'fixtureB',
                  type: 'fixture',
                  urlParams: {
                    component: 'dirB/Component2',
                    fixture: 'Some folder/fixtureB'
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

import fixturesToTreeData from '../data-mapper';

const input = {
  'dirA/Component1': ['fixtureA', 'fixtureB'],
  'dirB/Component2': ['fixtureA', 'fixtureB'],
  'dirB/Component3': ['fixtureA', 'fixtureB'],
  'dirB/subdirA/Component4': ['fixtureA', 'fixtureB']
};

test('transforms fixture data structure to tree data structure', () => {
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

import fixturesToTreeData from '../dataMapper';

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
      expanded: true,
      path: 'dirA',
      children: [
        {
          name: 'Component1',
          expanded: true,
          path: 'dirA/Component1',
          children: [
            {
              name: 'fixtureA',
              urlParams: {
                component: 'dirA/Component1',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
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
      expanded: true,
      path: 'dirB',
      children: [
        {
          name: 'Component2',
          expanded: true,
          path: 'dirB/Component2',
          children: [
            {
              name: 'fixtureA',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              urlParams: {
                component: 'dirB/Component2',
                fixture: 'fixtureB'
              }
            }
          ]
        },
        {
          name: 'Component3',
          expanded: true,
          path: 'dirB/Component3',
          children: [
            {
              name: 'fixtureA',
              urlParams: {
                component: 'dirB/Component3',
                fixture: 'fixtureA'
              }
            },
            {
              name: 'fixtureB',
              urlParams: {
                component: 'dirB/Component3',
                fixture: 'fixtureB'
              }
            }
          ]
        },
        {
          name: 'subdirA',
          expanded: true,
          path: 'dirB/subdirA',
          children: [
            {
              name: 'Component4',
              path: 'dirB/subdirA/Component4',
              expanded: true,
              children: [
                {
                  name: 'fixtureA',
                  urlParams: {
                    component: 'dirB/subdirA/Component4',
                    fixture: 'fixtureA'
                  }
                },
                {
                  name: 'fixtureB',
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

  expect(fixturesToTreeData(input)).toEqual(expected);
});

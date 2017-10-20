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
      expanded: true,
      children: [
        {
          name: 'Component1',
          expanded: true,
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
      children: [
        {
          name: 'Component2',
          expanded: true,
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
          children: [
            {
              name: 'Component4',
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

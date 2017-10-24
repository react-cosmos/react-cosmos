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
      children: [
        {
          name: 'Component1',
          type: 'component',
          expanded: true,
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
      children: [
        {
          name: 'Component2',
          type: 'component',
          expanded: true,
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
          children: [
            {
              name: 'Component4',
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

  expect(fixturesToTreeData(input)).toEqual(expected);
});

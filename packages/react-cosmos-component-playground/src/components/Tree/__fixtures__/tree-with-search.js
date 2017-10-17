export default {
  props: {
    nodeArray: [
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
            expanded: false,
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
    ],
    selected: {
      component: 'dirB/subdirA/Component4',
      fixture: 'fixtureA'
    },
    searchText: 'sub a',
    currentUrlParams: {},
    onSelect: href => console.log('Selected href: ', href),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

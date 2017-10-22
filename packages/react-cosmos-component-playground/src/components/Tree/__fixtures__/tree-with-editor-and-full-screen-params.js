export default {
  props: {
    nodeArray: [
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
            expanded: false,
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
    ],
    selected: {
      component: 'dirB/subdirA/Component4',
      fixture: 'fixtureA'
    },
    searchText: '',
    currentUrlParams: {
      editor: true,
      fullScreen: true
    },
    onSelect: href => console.log('Selected href: ', href),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

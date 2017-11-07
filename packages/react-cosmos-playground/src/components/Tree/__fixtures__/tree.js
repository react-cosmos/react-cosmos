import Tree from '../index';

export default {
  component: Tree,

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
                    name: 'Some folder',
                    type: 'fixtureDirectory',
                    expanded: true,
                    children: [
                      {
                        name: 'fixtureA',
                        type: 'fixture',
                        urlParams: {
                          component: 'dirB/subdirA/Component4',
                          fixture: 'Some folder/fixtureA'
                        }
                      },
                      {
                        name: 'fixtureB',
                        type: 'fixture',
                        urlParams: {
                          component: 'dirB/subdirA/Component4',
                          fixture: 'Some folder/fixtureB'
                        }
                      }
                    ]
                  },
                  {
                    name: 'Another folder',
                    type: 'fixtureDirectory',
                    expanded: true,
                    children: [
                      {
                        name: 'fixtureC',
                        type: 'fixture',
                        urlParams: {
                          component: 'dirB/subdirA/Component4',
                          fixture: 'Another folder/fixtureC'
                        }
                      }
                    ]
                  },
                  {
                    name: 'fixtureD',
                    type: 'fixture',
                    urlParams: {
                      component: 'dirB/subdirA/Component4',
                      fixture: 'fixtureD'
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
    currentUrlParams: {},
    onSelect: href => console.log('Selected href: ', href),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

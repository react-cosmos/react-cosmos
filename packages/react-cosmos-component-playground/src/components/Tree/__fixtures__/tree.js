export default {
  props: {
    nodeArray: [
      {
        name: 'dirA',
        expanded: true,
        component: 'dirA',
        children: [
          {
            name: 'Component1',
            expanded: true,
            component: 'dirA/Component1',
            children: [
              { name: 'fixtureA', component: 'dirA/Component1' },
              { name: 'fixtureB', component: 'dirA/Component1' }
            ]
          }
        ]
      },
      {
        name: 'dirB',
        expanded: true,
        component: 'dirB',
        children: [
          {
            name: 'Component2',
            expanded: true,
            component: 'dirB/Component2',
            children: [
              { name: 'fixtureA', component: 'dirB/Component2' },
              { name: 'fixtureB', component: 'dirB/Component2' }
            ]
          },
          {
            name: 'Component3',
            expanded: true,
            component: 'dirB/Component3',
            children: [
              { name: 'fixtureA', component: 'dirB/Component3' },
              { name: 'fixtureB', component: 'dirB/Component3' }
            ]
          },
          {
            name: 'subdirA',
            expanded: true,
            component: 'dirB/subdirA',
            children: [
              {
                name: 'Component4',
                expanded: true,
                component: 'dirB/subdirA/Component4',
                children: [
                  { name: 'fixtureA', component: 'dirB/subdirA/Component4' },
                  { name: 'fixtureB', component: 'dirB/subdirA/Component4' }
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
    onSelect: (node, expanded) =>
      console.log('Clicked on something: ', node, expanded)
  }
};

const children = [];
for (let i = 0; i < 100; i++) {
  children.push({
    name: `fixture${i}`,
    type: 'fixture',
    urlParams: {
      component: 'ComponentA',
      fixture: `fixture${i}`
    }
  });
}

export default {
  props: {
    nodeArray: [
      {
        name: 'ComponentA',
        type: 'component',
        expanded: true,
        children
      },
      {
        name: 'ComponentB',
        type: 'component',
        expanded: true,
        children: [
          {
            name: 'baz',
            type: 'fixture',
            urlParams: {
              component: 'ComponentB',
              fixture: 'baz'
            }
          },
          {
            name: 'qux',
            type: 'fixture',
            urlParams: {
              component: 'ComponentB',
              fixture: 'qux'
            }
          }
        ]
      }
    ],
    searchText: '',
    selected: {
      component: 'ComponentB',
      fixture: 'baz'
    },
    currentUrlParams: {},
    onSelect: href => console.log('Selected href: ', href),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

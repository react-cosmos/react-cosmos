const children = [];
for (let i = 0; i < 100; i++) {
  children.push({
    name: `fixture${i}`,
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
        expanded: true,
        children
      },
      {
        name: 'ComponentB',
        expanded: true,
        children: [
          {
            name: 'baz',
            urlParams: {
              component: 'ComponentB',
              fixture: 'baz'
            }
          },
          {
            name: 'qux',
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
    baseUrlParams: {},
    onSelect: urlParams => console.log('Selected urlParams: ', urlParams),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

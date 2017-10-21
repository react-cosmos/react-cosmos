import Tree from '../index';
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
  component: Tree,

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
    currentUrlParams: {},
    onSelect: href => console.log('Selected href: ', href),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

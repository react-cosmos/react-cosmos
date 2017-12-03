import Tree from '../index';

export default {
  component: Tree,

  props: {
    nodeArray: [
      {
        name: 'withRouter(connect(ComponentA))',
        path: 'withRouter(connect(ComponentA))',
        expanded: true,
        type: 'component',
        displayData: {
          componentName: 'ComponentA',
          hocs: ['withRouter', 'connect'],
          search: 'ComponentA withRouter, connect'
        },
        children: [
          {
            type: 'fixture',
            name: 'fixtureA',
            urlParams: {
              component: 'withRouter(connect(ComponentA))',
              fixture: 'fixtureA'
            }
          }
        ]
      }
    ],
    selected: {
      component: 'withRouter(connect(ComponentA))',
      fixture: 'fixtureA'
    },
    searchText: '',
    currentUrlParams: {},
    onSelect: href => console.log('Selected href: ', href),
    onToggle: (node, expanded) => console.log('Toggled node: ', node, expanded)
  }
};

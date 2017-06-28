export default {
  props: {
    loaderUri: '/mock/loader/index.html',
    router: {
      goTo: url => console.log('go to', url),
      routeLink: e => {
        e.preventDefault();
        console.log('link to', e.currentTarget.href);
      },
    },
    component: 'ComponentA',
    fixture: 'foo',
    editor: true,
  },
  state: {
    waitingForLoader: false,
    fixtures: {
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux'],
    },
  },
};

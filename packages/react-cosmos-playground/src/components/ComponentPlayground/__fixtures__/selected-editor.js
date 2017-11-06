import ComponentPlayground from '../index';

export default {
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test'
    },
    router: {
      goTo: url => console.log('go to', url),
      routeLink: e => {
        e.preventDefault();
        console.log('link to', e.currentTarget.href);
      }
    },
    component: 'ComponentA',
    fixture: 'foo',
    editor: true
  },

  state: {
    waitingForLoader: false,
    fixtures: {
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux']
    }
  },

  fetch: [
    {
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ]
};

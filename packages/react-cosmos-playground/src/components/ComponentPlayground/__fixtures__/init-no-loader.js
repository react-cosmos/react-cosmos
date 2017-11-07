import ComponentPlayground from '../index';

export default {
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test'
    },
    router: {}
  },

  fetch: [
    {
      matcher: 'end:/mock/loader/index.html',
      response: 404
    }
  ]
};

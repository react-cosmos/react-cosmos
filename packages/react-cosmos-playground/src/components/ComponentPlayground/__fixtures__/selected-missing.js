import ComponentPlayground from '..';
import { routerProps, init } from './_shared';

export default {
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test'
    },
    router: routerProps,
    component: 'ComponentA',
    fixture: 'foot'
  },

  fetch: [
    {
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ],

  init
};

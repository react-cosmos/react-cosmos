import ComponentPlayground from '../index';
import { routerProps, ref } from './_shared';

export default {
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test'
    },
    router: routerProps,
    component: 'ComponentA',
    fixture: 'foo'
  },

  fetch: [
    {
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ],

  ref
};

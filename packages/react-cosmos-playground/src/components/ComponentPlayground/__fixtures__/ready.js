import ComponentPlayground from '..';
import { routerProps, init } from './_shared';

export default {
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test'
    },
    router: routerProps
  },

  fetch: [
    {
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ],

  init
};

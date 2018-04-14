// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';
import { routerProps, init } from './_shared';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test',
      webpackConfigType: 'default',
      deps: {}
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

  init
});

// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';
import { routerProps, init } from './_shared';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/_loader-mock.html',
      projectKey: 'test',
      webpackConfigType: 'default',
      deps: {}
    },
    router: routerProps,
    component: 'ComponentA',
    fixture: 'foo',
    fullScreen: true
  },

  fetch: [
    {
      matcher: 'end:_loader-mock.html',
      response: 200
    }
  ],

  init
});

// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';
import { routerProps, init } from './_shared';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: {
      platform: 'web',
      projectKey: 'test',
      loaderUri: '/_loader-mock.html',
      webpackConfigType: 'default',
      deps: {}
    },
    router: routerProps,
    component: 'ComponentA',
    fixture: 'foo',
    editor: true
  },

  fetch: [
    {
      matcher: 'end:_loader-mock.html',
      response: 200
    }
  ],

  init
});

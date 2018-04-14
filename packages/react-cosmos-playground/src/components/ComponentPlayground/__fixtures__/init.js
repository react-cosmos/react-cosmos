// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test',
      webpackConfigType: 'default',
      deps: {}
    },
    router: {}
  },

  fetch: [
    {
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ]
});

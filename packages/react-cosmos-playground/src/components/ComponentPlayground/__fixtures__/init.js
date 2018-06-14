// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';

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
    router: {}
  },

  fetch: [
    {
      matcher: 'end:_loader-mock.html',
      response: 200
    }
  ]
});

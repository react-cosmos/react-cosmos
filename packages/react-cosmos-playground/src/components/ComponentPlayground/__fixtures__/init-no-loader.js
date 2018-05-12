// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: {
      loaderUri: '/_loader.html',
      projectKey: 'test',
      webpackConfigType: 'default',
      deps: {}
    },
    router: {}
  },

  fetch: [
    {
      matcher: 'end:_loader.html',
      response: 404
    }
  ]
});

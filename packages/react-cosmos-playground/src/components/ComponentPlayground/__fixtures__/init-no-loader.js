// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: {
      projectKey: 'test',
      loaderTransport: 'postMessage',
      loaderUri: '/_loader-mock.html',
      webpackConfigType: 'default',
      deps: {}
    },
    router: {}
  },

  fetch: [
    {
      matcher: 'end:_loader-mock.html',
      response: 404
    }
  ]
});

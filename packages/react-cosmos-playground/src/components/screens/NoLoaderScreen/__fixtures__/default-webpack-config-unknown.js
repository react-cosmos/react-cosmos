// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import NoLoaderScreen from '..';

export default createFixture({
  component: NoLoaderScreen,

  props: {
    options: {
      projectKey: 'foo',
      loaderTransport: 'postMessage',
      loaderUri: '/foo',
      webpackConfigType: 'default',
      deps: {
        'html-webpack-plugin': true
      }
    }
  }
});

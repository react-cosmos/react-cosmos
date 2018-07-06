// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import WebIndexErrorScreen from '..';

export default createFixture({
  component: WebIndexErrorScreen,

  props: {
    options: {
      platform: 'web',
      projectKey: 'foo',
      loaderUri: '/foo',
      webpackConfigType: 'default',
      deps: {
        'html-webpack-plugin': true
      }
    }
  }
});

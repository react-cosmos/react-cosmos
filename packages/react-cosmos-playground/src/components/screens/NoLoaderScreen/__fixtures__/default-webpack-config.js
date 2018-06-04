// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import NoLoaderScreen from '..';

export default createFixture({
  component: NoLoaderScreen,

  props: {
    options: {
      projectKey: 'foo',
      loaderUri: '/foo',
      webpackConfigType: 'default',
      deps: {
        'html-webpack-plugin': false
      }
    }
  }
});

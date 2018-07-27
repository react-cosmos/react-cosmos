// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import WebIndexErrorScreen from '..';
import { getOptions } from './_shared';

export default createFixture({
  component: WebIndexErrorScreen,

  props: {
    options: getOptions({
      webpackConfigType: 'custom',
      htmlPlugin: true
    })
  }
});

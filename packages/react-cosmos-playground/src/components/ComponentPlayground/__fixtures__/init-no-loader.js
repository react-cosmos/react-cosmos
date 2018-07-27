// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';
import { getOptions } from './_shared';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: getOptions(),
    router: {}
  },

  fetch: [
    {
      matcher: 'end:_loader-mock.html',
      response: 404
    }
  ]
});

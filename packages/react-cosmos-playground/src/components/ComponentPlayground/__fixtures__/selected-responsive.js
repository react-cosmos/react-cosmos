// @flow

import { createFixture } from 'react-cosmos-flow/fixture';
import ComponentPlayground from '..';
import { getOptions, routerProps, init } from './_shared';

export default createFixture({
  component: ComponentPlayground,

  props: {
    options: getOptions({
      plugin: {
        responsivePreview: {
          devices: [
            { label: 'iPhone 5', width: 320, height: 568 },
            { label: 'iPhone 6', width: 375, height: 667 },
            { label: 'iPhone 6 Plus', width: 414, height: 736 }
          ]
        }
      }
    }),
    router: routerProps,
    component: 'ComponentA',
    fixture: 'foo',
    editor: false
  },

  state: {
    fixtureBody: {
      viewport: {
        width: 375,
        height: 667
      }
    }
  },

  fetch: [
    {
      matcher: 'end:_loader-mock.html',
      response: 200
    }
  ],

  init
});

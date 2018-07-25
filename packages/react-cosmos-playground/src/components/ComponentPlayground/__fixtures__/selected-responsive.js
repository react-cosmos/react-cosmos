import ComponentPlayground from '..';
import { routerProps, init } from './_shared';

export default {
  component: ComponentPlayground,

  props: {
    options: {
      platform: 'web',
      loaderUri: '/mock/loader/index.html',
      projectKey: 'test',
      responsiveDevices: [
        { label: 'iPhone 5', width: 320, height: 568 },
        { label: 'iPhone 6', width: 375, height: 667 }
      ]
    },
    router: routerProps,
    component: 'ComponentA',
    fixture: 'foo',
    editor: true
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
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ],

  init
};

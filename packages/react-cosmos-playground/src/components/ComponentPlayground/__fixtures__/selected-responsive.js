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
        { label: 'iPhone 6', width: 375, height: 667 },
        { label: 'iPhone 6 Plus', width: 414, height: 736 },
        { label: 'Medium', width: 1024, height: 768 },
        { label: 'Large', width: 1440, height: 900 },
        { label: '1080p', width: 1920, height: 1080 }
      ]
    },
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
      matcher: 'end:/mock/loader/index.html',
      response: 200
    }
  ],

  init
};

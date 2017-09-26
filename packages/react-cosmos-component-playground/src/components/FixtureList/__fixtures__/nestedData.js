export default {
  props: {
    fixtures: {
      'dirA/Component1': ['fixtureA', 'fixtureB'],
      'dirB/Component2': ['fixtureA', 'fixtureB'],
      'dirB/Component3': ['fixtureA', 'fixtureB'],
      'dirB/subdirA/Component4': ['fixtureA', 'fixtureB']
    },
    urlParams: {},
    onUrlChange: newParams => {
      console.log('New URL Params:', newParams);
    }
  }
};

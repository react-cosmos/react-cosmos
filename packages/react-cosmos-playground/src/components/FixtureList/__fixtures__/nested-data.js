export default {
  props: {
    fixtures: {
      'dirA/Component1': ['fixtureA', 'fixtureB'],
      'dirB/Component2': ['fixtureA', 'fixtureB'],
      'dirB/Component3': ['fixtureA', 'fixtureB'],
      'dirB/subdirA/Component4': ['fixtureA', 'fixtureB']
    },
    urlParams: {},
    onUrlChange: url => {
      console.log('New url:', url);
    }
  }
};

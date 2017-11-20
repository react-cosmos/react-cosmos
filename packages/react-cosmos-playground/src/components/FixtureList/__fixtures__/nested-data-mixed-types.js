import FixtureList from '../index';

export default {
  component: FixtureList,

  props: {
    options: {
      projectKey: 'test'
    },
    fixtures: {
      Component1: ['fixtureA', 'fixtureB'],
      'nested/Component2': ['fixtureA', 'fixtureB']
    },
    urlParams: {},
    onUrlChange: url => {
      console.log('New url:', url);
    }
  }
};

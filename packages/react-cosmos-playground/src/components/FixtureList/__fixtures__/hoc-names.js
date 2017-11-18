import FixtureList from '../index';

export default {
  component: FixtureList,

  props: {
    options: {
      projectKey: 'test'
    },
    fixtures: {
      ComponentA: ['fixtureA'],
      'withRouter(ComponentA)': ['fixtureA'],
      'withRouter(connect(ComponentA))': ['fixtureA']
    },
    urlParams: {},
    onUrlChange: () => {}
  }
};

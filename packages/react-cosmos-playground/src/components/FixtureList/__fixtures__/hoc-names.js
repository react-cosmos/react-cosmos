import FixtureList from '../index';

export default {
  component: FixtureList,

  props: {
    options: {
      projectKey: 'test'
    },
    fixtures: {
      ThisIsAVeryLongComponentName: ['fixtureA'],
      'withRouter(ThisIsAVeryLongComponentName)': ['fixtureA'],
      'withRouter(connect(ComponentA))': ['fixtureA']
    },
    urlParams: {},
    onUrlChange: () => {}
  }
};

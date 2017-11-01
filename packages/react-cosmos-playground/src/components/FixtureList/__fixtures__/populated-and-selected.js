import FixtureList from '../index';

export default {
  component: FixtureList,

  props: {
    projectKey: 'test',
    fixtures: {
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux']
    },
    urlParams: {
      component: 'ComponentA',
      fixture: 'bar'
    },
    onUrlChange: () => {}
  }
};

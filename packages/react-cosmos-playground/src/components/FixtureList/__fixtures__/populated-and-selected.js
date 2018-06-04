import FixtureList from '..';

export default {
  component: FixtureList,

  props: {
    options: {
      projectKey: 'test'
    },
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

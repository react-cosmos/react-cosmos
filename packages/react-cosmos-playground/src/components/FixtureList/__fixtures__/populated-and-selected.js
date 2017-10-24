import FixtureList from '../index';

export default {
  component: FixtureList,

  props: {
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

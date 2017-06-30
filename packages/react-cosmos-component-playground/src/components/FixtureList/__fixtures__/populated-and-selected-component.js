export default {
  props: {
    fixtures: {
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux'],
    },
    urlParams: {
      component: 'ComponentA',
    },
    onUrlChange: () => {},
  },
};

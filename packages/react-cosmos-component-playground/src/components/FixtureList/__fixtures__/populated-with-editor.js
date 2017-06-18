export default {
  props: {
    fixtures: {
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux'],
    },
    urlParams: {
      editor: true,
    },
    onUrlChange: () => {},
  },
};

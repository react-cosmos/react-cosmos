export default {
  props: {
    value: {
      props: {
        foo: 'bar',
      },
    },
    onChange: value => console.log('change', value),
  },
  state: {
    error: 'Unexpected token x in JSON at position 36',
  },
};

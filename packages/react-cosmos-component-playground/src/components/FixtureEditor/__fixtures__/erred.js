export default {
  props: {
    value: {
      props: {
        foo: 'bar',
      },
    },
    onChange: value => console.log('change', value),
    onFocusChange: isFocused => console.log('focus', isFocused),
  },
  state: {
    error: 'Unexpected token x in JSON at position 36',
  },
};

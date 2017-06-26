export default {
  props: {
    value: {},
    onChange: value => console.log('change', value),
    onFocusChange: isFocused => console.log('focus', isFocused),
  },
};

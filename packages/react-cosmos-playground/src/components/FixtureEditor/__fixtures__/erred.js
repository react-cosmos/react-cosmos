import FixtureEditor from '..';

export default {
  component: FixtureEditor,

  props: {
    value: {
      props: {
        foo: 'bar'
      }
    },
    onChange: value => console.log('change', value)
  },

  state: {
    value: '{\n  "props": {\n    "foo": "bar"\n  }\n}z',
    isFocused: false,
    error: 'Unexpected token x in JSON at position 37'
  }
};

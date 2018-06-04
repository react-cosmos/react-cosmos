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
    isFocused: true
  }
};

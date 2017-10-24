import FixtureEditor from '../index';

export default {
  component: FixtureEditor,

  props: {
    value: {
      props: {
        foo: 'bar'
      }
    },
    onChange: value => console.log('change', value)
  }
};

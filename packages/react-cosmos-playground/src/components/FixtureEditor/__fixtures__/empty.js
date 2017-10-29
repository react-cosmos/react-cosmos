import FixtureEditor from '../index';

export default {
  component: FixtureEditor,

  props: {
    value: {},
    onChange: value => console.log('change', value)
  }
};

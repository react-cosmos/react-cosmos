import { Counter } from '.';

export default {
  component: Counter,

  props: {
    name: 'Awesome Counter'
  },

  state: {
    value: 5
  },

  viewport: {
    width: 320,
    height: 568
  }
};

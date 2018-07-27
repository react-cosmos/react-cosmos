import { CounterList } from '.';

export default {
  component: CounterList,

  state: {
    children: {
      c1: {
        value: 1
      },
      c2: {
        value: 2
      },
      c3: {
        value: 3
      }
    }
  },

  viewport: {
    width: 375,
    height: 667
  }
};

// @flow

import Bold from './Bold';

const baseFixture = {
  component: Bold
};

export default [
  {
    ...baseFixture,
    props: {
      name: 'Alina'
    }
  },
  {
    ...baseFixture,
    props: {
      name: 'Sarah'
    }
  }
];

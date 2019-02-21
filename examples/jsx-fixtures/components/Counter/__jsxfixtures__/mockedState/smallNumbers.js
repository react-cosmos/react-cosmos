// @flow

import React from 'react';
import { StateMock } from '@react-mock/state';
import { Counter } from '../..';

export default {
  five: (
    <StateMock state={{ count: 5 }}>
      <Counter suffix="times" />
    </StateMock>
  ),
  fifyFive: (
    <StateMock state={{ count: 55 }}>
      <Counter suffix="times" />
    </StateMock>
  )
};

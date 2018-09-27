// @flow

import React from 'react';
import { StateMock } from '@react-mock/state';
import { Counter } from '../components/Counter';

export default (
  <StateMock state={{ count: 5 }}>
    <Counter suffix="times" />
  </StateMock>
);

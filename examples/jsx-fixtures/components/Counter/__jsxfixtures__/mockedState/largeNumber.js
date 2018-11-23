// @flow

import React from 'react';
import { StateMock } from '@react-mock/state';
import { Counter } from '../..';

export default (
  <StateMock state={{ count: 555555555 }}>
    <Counter suffix="times" />
  </StateMock>
);

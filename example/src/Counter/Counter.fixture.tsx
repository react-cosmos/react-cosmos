import { StateMock } from '@react-mock/state';
import React from 'react';
import { Counter } from './Counter';

export default {
  default: <Counter suffix="times" />,

  'small number': (
    <StateMock state={{ count: 5 }}>
      <Counter suffix="times" />
    </StateMock>
  ),

  'large number': (
    <StateMock state={{ count: 555555555 }}>
      <Counter suffix="times" />
    </StateMock>
  ),
};

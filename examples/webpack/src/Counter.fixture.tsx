import { StateMock } from '@react-mock/state';
import { Counter } from 'examples-shared/components/Counter.js';
import React from 'react';

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

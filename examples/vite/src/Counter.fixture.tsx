import { Counter } from 'examples-shared/components/Counter.js';
import React from 'react';
import { ClassStateMock } from 'react-cosmos/client';

export default {
  default: <Counter suffix="times" />,

  'small number': (
    <ClassStateMock state={{ count: 5 }}>
      <Counter suffix="times" />
    </ClassStateMock>
  ),

  'large number': (
    <ClassStateMock state={{ count: 555555555 }}>
      <Counter suffix="times" />
    </ClassStateMock>
  ),
};

import React from 'react';
import { StateMock } from '@react-mock/state';
import { Counter } from '.';
import { Viewport } from 'react-cosmos/fixture';

export default {
  default: (
    <Viewport width={320} height={480}>
      <Counter suffix="times" />
    </Viewport>
  ),

  'small number': (
    <Viewport width={480} height={640}>
      <StateMock state={{ count: 5 }}>
        <Counter suffix="times" />
      </StateMock>
    </Viewport>
  ),

  'large number': (
    <StateMock state={{ count: 555555555 }}>
      <Counter suffix="times" />
    </StateMock>
  ),
};

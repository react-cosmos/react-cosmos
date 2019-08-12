import React from 'react';
import { CounterButton } from '.';
import * as Cosmos from './useNumber';

export default () => {
  const [count, setCount] = Cosmos.useNumber({
    inputName: 'count',
    defaultValue: 0
  });
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
      // TODO: Test this as well: increment={() => setCount(count + 1)}
    />
  );
};

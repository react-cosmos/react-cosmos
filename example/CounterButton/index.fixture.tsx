import React from 'react';
import { useNumber } from 'react-cosmos/fixture';
import { CounterButton } from '.';

export default () => {
  const [count, setCount] = useNumber('count');
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
    />
  );
};

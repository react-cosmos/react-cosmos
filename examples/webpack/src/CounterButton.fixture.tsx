import { CounterButton } from 'examples-shared/components/CounterButton.js';
import React from 'react';
import { useInput } from 'react-cosmos/client';

export default () => {
  const [count, setCount] = useInput('count', 0);
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
    />
  );
};

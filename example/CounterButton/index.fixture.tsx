import React from 'react';
import { useState } from 'react-cosmos/fixture';
import { CounterButton } from '.';

export default () => {
  const [count, setCount] = useState('count', { defaultValue: 0 });
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
    />
  );
};

import React from 'react';
import { useValue } from 'react-cosmos/fixture';
import { CounterButton } from '.';

export default () => {
  const [count, setCount] = useValue<number>('count', { defaultValue: 0 });
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(prevCount => prevCount + 1)}
    />
  );
};

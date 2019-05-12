import React from 'react';
import { CounterButton } from '.';

export default () => {
  const [count, setCount] = React.useState(0);
  return (
    <CounterButton
      suffix="times"
      count={count}
      increment={() => setCount(count + 1)}
    />
  );
};

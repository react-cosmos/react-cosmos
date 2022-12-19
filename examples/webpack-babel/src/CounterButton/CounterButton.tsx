import React from 'react';

type Props = {
  suffix: string;
  count: number;
  increment: () => unknown;
};

export function CounterButton({ suffix, count, increment }: Props) {
  return (
    <button onClick={increment}>
      {count} {suffix}
    </button>
  );
}

import React from 'react';

type Props = {
  suffix: string;
  count: number;
  increment: () => unknown;
};

export function CounterButton({ suffix, count, increment }: Props) {
  return (
    <button title="Click to increment" onClick={increment}>
      {count} {suffix}
    </button>
  );
}

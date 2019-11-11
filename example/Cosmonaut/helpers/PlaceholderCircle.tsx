import React from 'react';
import { useValue } from 'react-cosmos/fixture';

type CircleProps = {
  cx: number;
  cy: number;
  r: number;
};

export function PlaceholderCircle(props: CircleProps) {
  const [cx] = useValue('cx', { defaultValue: props.cx });
  const [cy] = useValue('cy', { defaultValue: props.cy });
  const [r] = useValue('r', { defaultValue: props.r });
  return <circle cx={cx} cy={cy} r={r} fill="red" />;
}

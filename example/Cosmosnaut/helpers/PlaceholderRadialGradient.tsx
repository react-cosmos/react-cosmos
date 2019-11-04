import React from 'react';
import { useValue } from 'react-cosmos/fixture';

type Props = {
  id: string;
  cx: number;
  cy: number;
  r: number;
  offset1: number;
  offset2: number;
  color1: string;
  color2: string;
};

export function PlaceholderRadialGradient(props: Props) {
  const [cx] = useValue('cx', { defaultValue: props.cx });
  const [cy] = useValue('cy', { defaultValue: props.cy });
  const [r] = useValue('r', { defaultValue: props.r });
  const [offset1] = useValue('offset1', { defaultValue: props.offset1 });
  const [offset2] = useValue('offset2', { defaultValue: props.offset2 });
  const [color1] = useValue('color1', { defaultValue: props.color1 });
  const [color2] = useValue('color2', { defaultValue: props.color2 });
  return (
    <radialGradient id={props.id} cx={cx} cy={cy} r={r}>
      <stop offset={`${offset1}%`} stopColor={color1} />
      <stop offset={`${offset2}%`} stopColor={color2} />
    </radialGradient>
  );
}

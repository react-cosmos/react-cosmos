import React from 'react';
import { useValue } from 'react-cosmos/fixture';

type Props = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

export function PlaceholderEllipse(props: Props) {
  const [cx] = useValue('cx', { defaultValue: props.cx });
  const [cy] = useValue('cy', { defaultValue: props.cy });
  const [rx] = useValue('rx', { defaultValue: props.rx });
  const [ry] = useValue('ry', { defaultValue: props.ry });
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="red" />;
}

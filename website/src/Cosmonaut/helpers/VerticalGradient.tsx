import React from 'react';

type Props = {
  id: string;
  topColor: string;
  bottomColor: string;
};

export function VerticalGradient({ id, topColor, bottomColor }: Props) {
  return (
    <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={topColor} />
      <stop offset="100%" stopColor={bottomColor} />
    </linearGradient>
  );
}

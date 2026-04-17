import React from 'react';
import type { SvgChildren } from './BaseSvg.js';
import { BaseSvg } from './BaseSvg.js';

type Props = {
  children: SvgChildren;
  viewBox: string;
  size?: number | string;
};

export function Illustration({ children, viewBox, size = '100%' }: Props) {
  return (
    <BaseSvg width={size} height={size} viewBox={viewBox}>
      {children}
    </BaseSvg>
  );
}

import React from 'react';
import { BaseSvg, SvgChildren } from './BaseSvg.js';

export type IconProps = {
  size?: number | string;
  strokeWidth?: number;
};

type Props = IconProps & {
  children: SvgChildren;
};
export function Icon({ children, size = '100%', strokeWidth = 1.5 }: Props) {
  return (
    <BaseSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </BaseSvg>
  );
}

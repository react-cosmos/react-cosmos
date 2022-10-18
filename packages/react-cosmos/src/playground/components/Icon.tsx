import React from 'react';
import { BaseSvg, SvgChildren } from './BaseSvg';

type IconProps = {
  children: SvgChildren;
  size?: number | string;
};

export function Icon({ children, size = '100%' }: IconProps) {
  return (
    <BaseSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </BaseSvg>
  );
}

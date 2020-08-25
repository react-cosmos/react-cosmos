import React from 'react';
import styled from 'styled-components';

type SvgElementType = React.ReactElement<
  | 'path'
  | 'polyline'
  | 'line'
  | 'circle'
  | 'ellipse'
  | 'rect'
  | 'polygon'
  | 'g'
  | 'defs'
  | 'title'
>;

type SvgChildren = SvgElementType | SvgElementType[];

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

type IllustrationProps = {
  children: SvgChildren;
  viewBox: string;
  size?: number | string;
};

export function Illustration({
  children,
  viewBox,
  size = '100%',
}: IllustrationProps) {
  return (
    <BaseSvg width={size} height={size} viewBox={viewBox}>
      {children}
    </BaseSvg>
  );
}

function BaseSvg({
  children,
  ...attrs
}: {
  children: SvgChildren;
  [attr: string]: unknown;
}) {
  return (
    <StyledSvg xmlns="http://www.w3.org/2000/svg" {...attrs}>
      {children}
    </StyledSvg>
  );
}

const StyledSvg = styled.svg`
  display: block;
`;

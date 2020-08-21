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
  size?: number | string;
  children: SvgChildren;
};

export function Icon({ size = '100%', children }: IconProps) {
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

export function Illustration({
  children,
  viewBox,
}: {
  children: SvgChildren;
  viewBox: string;
}) {
  return <BaseSvg viewBox={viewBox}>{children}</BaseSvg>;
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

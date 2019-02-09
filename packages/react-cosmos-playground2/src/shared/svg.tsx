import * as React from 'react';
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

export function Icon({ children }: { children: SvgChildren }) {
  return (
    <BaseSvg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </BaseSvg>
  );
}

export function Illustration({
  children,
  viewBox
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
  width: 100%;
  height: 100%;
`;

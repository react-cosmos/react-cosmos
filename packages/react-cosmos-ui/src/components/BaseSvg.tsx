import React from 'react';
import styled from 'styled-components';

export type SvgElementType = React.ReactElement<
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

export type SvgChildren = SvgElementType | SvgElementType[];

type Props = {
  children: SvgChildren;
  [attr: string]: unknown;
};

export function BaseSvg({ children, ...attrs }: Props) {
  return (
    <StyledSvg xmlns="http://www.w3.org/2000/svg" {...attrs}>
      {children}
    </StyledSvg>
  );
}

const StyledSvg = styled.svg`
  display: block;
`;

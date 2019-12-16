import React from 'react';
import styled from 'styled-components';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';
import { Tube } from './Tube';

type Props = {
  width: number;
  height: number;
};

export function FullScreenCosmonaut({ width, height }: Props) {
  return (
    <SvgContainer viewBox="0 -640 768 768" style={{ width, height }}>
      <StyledSky x={0} y={-512} width={768} height={1024} />
      <Stars />
      <g transform={`translate(${-60}, ${-112})`}>
        <Planet />
      </g>
      <Tube />
      <Body />
      <Helmet />
    </SvgContainer>
  );
}

const SvgContainer = styled.svg`
  display: block;
`;

const StyledSky = styled.rect`
  fill: #093556;
`;

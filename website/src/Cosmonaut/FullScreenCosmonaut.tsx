import React from 'react';
import styled from 'styled-components';
import {
  getCosmonautSize,
  getViewportLength,
  Viewport
} from '../shared/viewport';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';
import { Tube } from './Tube';

type Props = {
  windowViewport: Viewport;
};

export function FullScreenCosmonaut({ windowViewport }: Props) {
  const { width, height } = getFullScreenCosmonautViewport(windowViewport);
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

function getFullScreenCosmonautViewport(windowViewport: Viewport) {
  const width = getViewportLength(windowViewport);
  return { width, height: Math.ceil(getCosmonautSize(windowViewport) * 4) };
}

const SvgContainer = styled.svg`
  display: block;
`;

const StyledSky = styled.rect`
  fill: #093556;
`;

import React from 'react';
import styled from 'styled-components';
import { Body } from './Body.js';
import { Helmet } from './Helmet.js';
import { Planet } from './Planet.js';
import { Stars } from './Stars.js';
import { Tube } from './Tube.js';

export function CroppedCosmonaut() {
  return (
    <SvgContainer viewBox="0 0 256 256">
      <defs>
        <clipPath id="skyMask">
          <circle cx="128" cy="128" r="128" />
        </clipPath>
      </defs>

      <g clipPath="url(#skyMask)">
        <StyledSky x={0} y={0} width={256} height={256} />
        <Stars />
        <Planet />
        <Tube />
      </g>
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

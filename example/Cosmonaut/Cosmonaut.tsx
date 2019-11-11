import React from 'react';
import styled from 'styled-components';
import { Body } from './Body';
import { Helmet } from './Helmet';
import { Planet } from './Planet';
import { Stars } from './Stars';

export function Cosmonaut() {
  return (
    <SvgContainer viewBox="0 0 256 256">
      <Sky />
      <Planet />
      <Stars />
      <Body />
      <Helmet />
    </SvgContainer>
  );
}

const SvgContainer = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Sky = styled.rect.attrs({ x: 0, y: 0, width: 256, height: 256 })`
  fill: #093556;
  clip-path: circle(50% at 50% 50%);
`;
